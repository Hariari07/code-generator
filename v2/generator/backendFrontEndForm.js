const fs = require("fs");
const path = require("path");

const inputFile = path.join(__dirname, "../inputs/inputGenerator.json");
const outputDir = path.join(__dirname, "../outputs/generatedCode");

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const tables = JSON.parse(fs.readFileSync(inputFile, "utf-8"));
const frontEndCommanUrl = JSON.parse(fs.readFileSync(inputFile, "utf-8"));


// -----------------------
// Utility
// -----------------------
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// -----------------------
// Generator
// -----------------------
tables.forEach((table) => {
  const { tableName, dbName, primaryKey, fields, frontend } = table;

  const tableOutputDir = path.join(outputDir, tableName);
  if (!fs.existsSync(tableOutputDir))
    fs.mkdirSync(tableOutputDir, { recursive: true });

  // ======================================================
  // MODEL
  // ======================================================
  const model = `const getDatabaseConnection = require("../../../config/db");

// -----------------------
// Get Next Ref No
// -----------------------
async function getRefNo${tableName}() {
  const dbPool = getDatabaseConnection("${dbName}");
  const [rows] = await dbPool.query(
    "SELECT IFNULL(MAX(${primaryKey}),0)+1 AS nextNo FROM ${tableName}"
  );
  return rows[0].nextNo.toString().padStart(5, "0");
}

// -----------------------
// Pagination + Filter
// -----------------------
async function getAllPaginated${tableName}(page, size, sortField, sortOrder, filters) {
  const dbPool = getDatabaseConnection("${dbName}");

  let whereClause = "WHERE 1=1";
  const values = [];

  const allowedFields = ${JSON.stringify(fields)};

  for (const key in filters) {
    if (!allowedFields.includes(key)) continue;

    const { value, matchMode } = filters[key];
    if (value === null || value === undefined) continue;

    switch (matchMode) {
      case "equals":
        whereClause += \` AND \${key} = ?\`;
        values.push(value);
        break;
      case "contains":
        whereClause += \` AND \${key} LIKE ?\`;
        values.push(\`%\\\${value}%\`);
        break;
      case "startsWith":
        whereClause += \` AND \${key} LIKE ?\`;
        values.push(\`\\\${value}%\`);
        break;
      case "endsWith":
        whereClause += \` AND \${key} LIKE ?\`;
        values.push(\`%\\\${value}\`);
        break;
    }
  }

  const safeSort = allowedFields.includes(sortField)
    ? sortField
    : "${primaryKey}";

  const order = sortOrder === 1 ? "ASC" : "DESC";
  const offset = page * size;

  const query = \`
    SELECT ${fields.filter(f => f !== primaryKey).join(",")}
    FROM ${tableName}
    \${whereClause}
    ORDER BY \${safeSort} \${order}
    LIMIT ? OFFSET ?
  \`;

  values.push(size, offset);

  const [data] = await dbPool.query(query, values);
  const [[{ total }]] = await dbPool.query(
    \`SELECT COUNT(*) total FROM ${tableName} \${whereClause}\`,
    values.slice(0, -2)
  );

  return { data, total };
}

// -----------------------
// Get All
// -----------------------
async function getAllPlain${tableName}() {
  const dbPool = getDatabaseConnection("${dbName}");
  const [rows] = await dbPool.query(
    "SELECT ${fields.filter(f => f !== primaryKey).join(",")} FROM ${tableName} ORDER BY ${primaryKey} DESC"
  );
  return rows;
}

// -----------------------
// Get By ID
// -----------------------
async function getById${tableName}(id) {
  const dbPool = getDatabaseConnection("${dbName}");
  const [rows] = await dbPool.query(
    "SELECT ${fields.filter(f => f !== primaryKey).join(",")} FROM ${tableName} WHERE ${primaryKey}=?",
    [id]
  );
  return rows[0];
}

// -----------------------
// Exists
// -----------------------
async function ${tableName}Exists(id) {
  const dbPool = getDatabaseConnection("${dbName}");
  const [rows] = await dbPool.query(
    "SELECT 1 FROM ${tableName} WHERE ${primaryKey}=?",
    [id]
  );
  return rows.length > 0;
}

// -----------------------
// Insert
// -----------------------
async function insert${tableName}(data) {
  const dbPool = getDatabaseConnection("${dbName}");
  const q = \`INSERT INTO ${tableName} (${fields.join(",")}) VALUES (?)\`;
  const values = [${fields.map(f => `data.${f}`).join(",")}];
  const [result] = await dbPool.query(q, [values]);
  return result.insertId;
}

// -----------------------
// Update
// -----------------------
async function update${tableName}(id, data) {
  const dbPool = getDatabaseConnection("${dbName}");
  const setClause = "${fields
      .filter(f => f !== primaryKey)
      .map(f => `${f}=?`)
      .join(",")}";

  const values = [${fields
      .filter(f => f !== primaryKey)
      .map(f => `data.${f}`)
      .join(",")} , id];

  await dbPool.query(
    \`UPDATE ${tableName} SET \${setClause} WHERE ${primaryKey}=?\`,
    values
  );
  return true;
}

module.exports = {
  getRefNo${tableName},
  getAllPaginated${tableName},
  getAllPlain${tableName},
  getById${tableName},
  ${tableName}Exists,
  insert${tableName},
  update${tableName}
};
`;

  // ======================================================
  // SERVICE
  // ======================================================
  const service = `const model = require("./${tableName}.model");

// -----------------------
async function getPaginated${tableName}(page, size, sortField, sortOrder, filters) {
  return model.getAllPaginated${tableName}(page, size, sortField, sortOrder, filters);
}

async function readAllPlain${tableName}() {
  return model.getAllPlain${tableName}();
}

async function readById${tableName}(id) {
  return model.getById${tableName}(id);
}

async function create${tableName}(data) {
  return model.insert${tableName}(data);
}

async function modify${tableName}(id, data) {
  return model.update${tableName}(id, data);
}

async function getNextRefNo${tableName}() {
  return model.getRefNo${tableName}();
}

module.exports = {
  getPaginated${tableName},
  readAllPlain${tableName},
  readById${tableName},
  create${tableName},
  modify${tableName},
  getNextRefNo${tableName}
};
`;

  // ======================================================
  // CONTROLLER
  // ======================================================
  const controller = `const service = require("./${tableName}.service");

async function getPaginated${tableName}(req, res) {
  try {
    const { page=0, size=10, sortField="", sortOrder=1, filters={} } = req.body;
    const result = await service.getPaginated${tableName}(page, size, sortField, sortOrder, filters);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getAllPlain${tableName}(req, res) {
  const data = await service.readAllPlain${tableName}();
  res.json({ data });
}

async function getById${tableName}(req, res) {
  const data = await service.readById${tableName}(req.body.${primaryKey});
  res.json({ data });
}

async function create${tableName}(req, res) {
  await service.create${tableName}(req.body);
  res.status(201).json({ message: "success" });
}

async function update${tableName}(req, res) {
  await service.modify${tableName}(req.body.${primaryKey}, req.body);
  res.json({ message: "success" });
}

async function getRefNo${tableName}(req, res) {
  const nextNo = await service.getNextRefNo${tableName}();
  res.json({ nextNo });
}

module.exports = {
  getPaginated${tableName},
  getAllPlain${tableName},
  getById${tableName},
  create${tableName},
  update${tableName},
  getRefNo${tableName}
};
`;

  // ======================================================
  // ROUTES
  // ======================================================
  const routes = `const express = require("express");
const controller = require("./${tableName}.controller");
const router = express.Router();

router.post("/${tableName}/paginated", controller.getPaginated${tableName});
router.get("/${tableName}/all", controller.getAllPlain${tableName});
router.post("/${tableName}/single", controller.getById${tableName});
router.post("/${tableName}/create", controller.create${tableName});
router.post("/${tableName}/update", controller.update${tableName});
router.get("/${tableName}/refno", controller.getRefNo${tableName});

module.exports = router;
`;


  // ======================================================
  // WRITE FILES
  // ======================================================
  fs.writeFileSync(path.join(tableOutputDir, `${tableName}.model.js`), model);
  fs.writeFileSync(path.join(tableOutputDir, `${tableName}.service.js`), service);
  fs.writeFileSync(path.join(tableOutputDir, `${tableName}.controller.js`), controller);
  fs.writeFileSync(path.join(tableOutputDir, `${tableName}.routes.js`), routes);

  console.log(`✅ Generated backend for ${tableName}`);

  // END ////////

  // -------------------
  // Frontend Form Generator (unchanged)
  // -------------------
  if (frontend && frontend.fields && frontend.fields.length) {
    const outputHtmlFile = path.join(tableOutputDir, `${tableName}.form.component.html`);
    const outputTsFile = path.join(tableOutputDir, `${tableName}.form.service.ts`);
    const outputTsFileComponet = path.join(tableOutputDir, `${tableName}.form.component.ts`);

    const formName = frontend.formName || "createForm";
    const ffields = frontend.fields;
    const col = frontend.columns || 1;
    const patterns = "^[0-9_-]{10,12}";
    const fieldsPerCol = Math.ceil(ffields.length / col);

    // HTML
    let html = `<form [formGroup]="${formName}">\n<div class="grid">\n`;
    for (let c = 0; c < col; c++) {
      html += `  <div class="col">\n`;
      const startIndex = c * fieldsPerCol;
      const endIndex = startIndex + fieldsPerCol;
      ffields.slice(startIndex, endIndex).forEach((f) => {
        html += `    <div class="mb-2">\n      <p-iftalabel>\n`;
        if (["InputText", "InputNumber"].includes(f.primengModule)) {
          const type = f.type === "number" ? "number" : "text";
          html += `        <input type="${type}" class="w-full" pInputText id="${f.fieldName}" formControlName="${f.fieldName}"`;
          if (f.type === "number") html += ` [pattern]="patterns"`;
          html += ` />\n`;
        } else if (f.primengModule === "Select") {
          html += `        <p-select  [(ngModel)]="selected${f.fieldName}" inputId="${f.fieldName}" [options]="${f.fieldName}Options" placeholder="Select" optionLabel="label" class="w-full" formControlName="${f.fieldName}" appendTo="body"></p-select>\n`;
        } else if (f.primengModule === "password") {
          html += `<p-password formControlName="${f.fieldName}" inputStyleClass="w-full" styleClass="w-full"></p-password>\n`;
        } else if (f.primengModule === "DatePicker") {
          html += `         <p-datepicker id="${f.fieldName}" formControlName="${f.fieldName}" [showIcon]="true" appendTo="body"/>\n`;
        } else if (f.primengModule === "Textarea") {
          const rows = f.rows || 2;
          const cols = f.cols || 30;
          const style = f.style ? ` style="${f.style}"` : "";
          html += `          <textarea class="w-full" pTextarea id="${f.fieldName}" rows="${rows}" cols="${cols}" formControlName="${f.fieldName}"${style}></textarea>\n`;
        } else if (f.primengModule === "multiselect") {
          html += `        <p-multiSelect [(ngModel)]="selected${f.fieldName}" inputId="${f.fieldName}" [options]="${f.fieldName}Options" placeholder="Select" optionLabel="label" class="w-full" formControlName="${f.fieldName}" appendTo="body"></p-multiSelect>\n`;
        }
        html += `        <label class="iftalabelSize" for="${f.fieldName}">${f.label}</label>\n      </p-iftalabel>\n    </div>\n`;
      });
      html += `  </div>\n`;
    }
    html += `</form>\n`;

    html += `
    <div class="flex justify-content-between">
          <div class="flex flex-wrap gap-2 justify-content-start">
            <p-button label="Apply" [disabled]="!isBtnDisabled${tableName}" severity="warn" icon="pi pi-check-circle"
              (onClick)="apply${tableName}()" />

            @if (isEditable${tableName}) {
            <p-button label="Update" [disabled]="isBtnDisabled${tableName}" icon="pi pi-save" (onClick)="edit${tableName}()" />
            }
            @if (!isEditable${tableName}) {
            <p-button label="Save" [disabled]="isBtnDisabled${tableName}" icon="pi pi-save" (onClick)="save${tableName}()" />
            }
            <p-button label="Roll Back" [disabled]="isRollBack" icon="pi pi-refresh" (onClick)="rollBack${tableName}()"
              styleClass="p-button-info" />
            @if (!isEditable${tableName}) {
            <p-button label="Reset" icon="pi pi-undo" (onClick)="reset${tableName}()" severity="danger" />
            }
            @if (workFlowEnabled) {
            <p-button label="Re-Approval" icon="pi  pi-refresh" [styleClass]="'cusButton'" severity="danger"
              (onClick)="reApproveBasic()" [disabled]="selectedStage !== 2" />
            }
          </div>
        </div>\n\n
    `;




    // TS Generator Service
    let tsService = `import { Component } from '@angular/core';\nimport { FormGroup, FormControl, Validators } from '@angular/forms';\nimport config from '../../../../assets/data.json';\n\n@Component({\n  selector: 'app-${tableName}-form',\n  templateUrl: './${tableName}.form.component.html',\n  styleUrls: ['./${tableName}.form.component.css']\n})\nexport class ${capitalize(tableName)}FormComponent {\n
    `;
    tsService += `  patterns = "${patterns}";\n\n`;

    tsService += `apiurl = \`\${config.hostip}:\${config.hostport}/\${config.commonAPI}\`;\n\n`

    ffields.forEach(f => {
      if (f.primengModule === "Select" && f.options) {
        const optionsArray = f.options.map(o => `{ label: '${o}', value: '${o}' }`);
        tsService += `  ${f.fieldName}Options = [${optionsArray.join(", ")}];\n`;
        tsService += `  selected${f.fieldName}: any;\n \n`;
      } else if (f.primengModule === "multiselect" && f.options) {
        const optionsArray = f.options.map(o => `{ label: '${o}', value: '${o}' }`);
        tsService += `  ${f.fieldName}Options = [${optionsArray.join(", ")}];\n`;
        tsService += `  selected${f.fieldName}: any;\n \n`;
      }
    });

    tsService += `  ${formName} = new FormGroup({\n`;
    ffields.forEach(f => {
      let validators = [];
      if (f.required) validators.push("Validators.required");
      if (f.type === "email") validators.push("Validators.email");
      if (f.type === "number") validators.push(`Validators.pattern(this.patterns)`);
      tsService += `    ${f.fieldName}: new FormControl<${f.type === "number" ? "number | null" : f.type === "date" ? "Date | null" : "string"
        }>(${f.type === "number" || f.type === "date" ? "null" : "''"}${validators.length > 0 ? `, { validators: [${validators.join(", ")}] }` : ""
        }),\n`;
    });
    tsService += `  });\n\n`;


    tsService += `

    async getMasRefNo${tableName}(): Promise<any> {
    const data: Observable<any> = this._http.get(this.apiurl + '${frontEndCommanUrl[0].frontEndCommanUrl}/${tableName}/refno');
    return lastValueFrom(data);
    }

    async getAllData${tableName}(): Promise<any> {
    const data: Observable<any> = this._http.get(this.apiurl + '${frontEndCommanUrl[0].frontEndCommanUrl}/${tableName}/all');
    return lastValueFrom(data);
    }

    insert${tableName}(payload: any) {
      return this._http.post(this.apiurl + '${frontEndCommanUrl[0].frontEndCommanUrl}/${tableName}/create', payload);
    };

    update${tableName}(payload: any) {
      return this._http.post(this.apiurl + '${frontEndCommanUrl[0].frontEndCommanUrl}/${tableName}/create', payload);
    };

    async seqRun${tableName}(): Promise<any[]> {
    try {
      // Sequentially fetch data using async/await
      const refNo = await this.getMasRefNo${tableName}();
      const allData = await this.getAllData${tableName}();     
      return [refNo, allData];
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
    }
    \n}\n
    `

    let tsComponent = `
    
    // Own file service ts
    service = inject();
    
    //  Data Var
    seqData: any[] = [];
    
    refNo${tableName}: any;
    editRefNo${tableName}: any;

    ${tableName}Data: any[] = [];

    // String Var
    jbTittleSave${tableName}: any;
    jbTittleEdit${tableName}: any;
    dbTittle${tableName}: any;

    // Boolean Var
    // Main page loading Progress Bar
    isMainPageLoading: boolean = true;
    
    // Save, Edit Data loading progress bar
    dataProcessLoading${tableName}: boolean = false;

    // DialogBox
    dbVisible${tableName}: boolean = false;


    // Display Info
    displayInfo${tableName}: boolean = false;

    // Justify Box
    jbVisibleSave${tableName}: boolean = false;
    jbVisibleEdit${tableName}: boolean = false;
    
    // Edit
    isEditable${tableName}: boolean = false;

    
    // Buttons
    isBtnDisabled${tableName}: boolean = false;
    
    // Roll Back
    isRollBack${tableName}: Boolean = true;

    // WorkFlow
    workFlowEnabled: boolean = false;
    selectedStage: any;

    ngOnInit(): void {  
       this.startUp();
    }

    ngAfterViewInit(): void {
      
    }
    
    async startUp() {
    try {
      // Fetch the data sequentially
      this.seqData = await this.service.seqRun();
      // Load Data
      this.${tableName}Refno = await this.seqData[0].data;
      this.${tableName}Data = await this.seqData[1].data;
     
      } else {
        this.isLoading = true;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    }

    // Button Functions
    async apply${tableName}(){
    
    }

    async save${tableName}(){
      this.jbOpenSave${tableName}()
    }

    async edit${tableName}(){
      this.jbOpenEdit${tableName}()
    }

    async rollBack${tableName}(){
    
    }

    async reset${tableName}(){
    
    }



    
    // Reset
    reset${tableName}(){
    
    }

    // Reload
    reload${tableName}(){
    
    }

    // Submit Functions
    insert${tableName}(payload){
      await this.service.insert${tableName}(payLoad).subscribe({
      next: async (response: any) => {
        if (response.message == "success") {
          await this.messageService.add({ severity: 'success', summary: 'success', detail: 'None Created Successfully!', life: 8000 });
          await this.reset${tableName}();
          await this.reload${tableName}();          
        }
      }
     });
    }

    update${tableName}(id, payload){
      await this.service.update${tableName}(payLoad).subscribe({
      next: async (response: any) => {
        if (response.message == "success") {
          await this.messageService.add({ severity: 'success', summary: 'success', detail: 'None Updated Successfully!', life: 8000 });
          await this.resetAddress();
          await this.reload();         
        }
      }
    });
    }

    // Dialog Box funtions
    dbOpen${tableName}(){
      this.dbTittle${tableName} = "None"    
      this.dbVisible${tableName}: boolean = true;
    }

    dbDismiss${tableName}(){
      this.dbTittle${tableName} = null;
      this.dbVisible${tableName}: boolean = false;
    }

    dbCloseEvent${tableName}(){
      this.dbTittle${tableName} = null;
      this.dbVisible${tableName}: boolean = false;
    }



    // Justify Box functions
    jbOpenSave${tableName}(){
      this.jbTittleSave${tableName} = "None"
      this.jbVisibleSave${tableName}: boolean = true;
    }

    jbOpenEdit${tableName}(){
      this.jbTittleEdit${tableName} = "None"
      this.jbVisibleEdit${tableName}: boolean = true;
    }

    jbDismissSave${tableName}(){
      this.jbTittleSave${tableName} = null;
      this.jbVisibleSave${tableName}: boolean = false;
    }

       jbDismissEdit${tableName}(){
      this.jbTittleEdit${tableName} = null;
      this.jbVisibleEdit${tableName}: boolean = false;
    }

    jbCloseEventSave${tableName}(){
      this.jbTittleSave${tableName} = null;
      this.jbVisibleSave${tableName}: boolean = false;
    
    }

    jbCloseEventEdit${tableName}(){
      this.jbTittleEdit${tableName} = null;
      this.jbVisibleEdit${tableName}: boolean = false;
    
    }

    async jbInsert${tableName}(justify: any){
      const payLoad = {
        id: ,
        data: ,
        empData: empData,
        selDbData: selDbData,
        justify: justify,
        workFlowEnabled: this.workFlowEnabled
      }
      
      this.insert${tableName}(payload);
    }

    async jbUpdate${tableName}(justify: any){
      const payLoad = {
        uniqueId: ,
        dataId: ,
        data: ,
        empData: empData,
        selDbData: selDbData,
        justify: justify,
        workFlowEnabled: this.workFlowEnabled
      }
      this.update${tableName}(payload);
    }


  





    `


    fs.writeFileSync(outputHtmlFile, html, "utf-8");
    fs.writeFileSync(outputTsFile, tsService, "utf-8");
    fs.writeFileSync(outputTsFileComponet, tsComponent, "utf-8");
    console.log(`✅ Frontend form generated for table: ${tableName}`);
  }



});

console.log("🎉 ALL CODE GENERATED SUCCESSFULLY");
