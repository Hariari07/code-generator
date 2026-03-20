const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../inputs/inputGenerator.json');
const outputDir = path.join(__dirname, '../outputs/generatedCode');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const tables = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));

// -----------------------
// Utility
// -----------------------
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// -----------------------
// Iterate over each table
// -----------------------
tables.forEach((table) => {
  const { tableName, dbName, primaryKey, fields, frontend } = table;
  const tableOutputDir = path.join(outputDir, tableName);
  if (!fs.existsSync(tableOutputDir)) fs.mkdirSync(tableOutputDir, { recursive: true });


  // -------------------
// Backend Generator (with getRefNo)
// -------------------
const modelFile = path.join(tableOutputDir, `${tableName}.model.js`);
const serviceFile = path.join(tableOutputDir, `${tableName}.service.js`);
const controllerFile = path.join(tableOutputDir, `${tableName}.controller.js`);
const routeFile = path.join(tableOutputDir, `${tableName}.routes.js`);

// -------------------
// Model
// -------------------
const model = `const getDatabaseConnection = require("../../../config/db");

// Get next RefNo
async function getRefNo() {
  const dbPool = getDatabaseConnection("${dbName}");
  const q = "SELECT IFNULL(MAX(${primaryKey}),0)+1 as nextNo FROM ${tableName}";
  const [rows] = await dbPool.query(q);
  return rows[0].nextNo.toString().padStart(5,"0");
}

// Get all
async function getAll(filter = {}, limit = 100, offset = 0) {
  const dbPool = getDatabaseConnection("${dbName}");
  let query = "SELECT * FROM ${tableName} WHERE 1=1";
  const params = [];
  for (const key in filter) {
    query += \` AND \${key} = ?\`;
    params.push(filter[key]);
  }
  query += " ORDER BY ${primaryKey} DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);
  const [rows] = await dbPool.query(query, params);
  return rows;
}

// Get single record
async function getById(${primaryKey}) {
  const dbPool = getDatabaseConnection("${dbName}");
  const [rows] = await dbPool.query("SELECT * FROM ${tableName} WHERE ${primaryKey} = ?", [${primaryKey}]);
  return rows[0];
}

// Insert
async function insert(dataArray) {
  const dbPool = getDatabaseConnection("${dbName}");
  const values = Array.isArray(dataArray) ? dataArray : [dataArray];
  const q = "INSERT INTO ${tableName} (${fields.join(",")}) VALUES ?";
  const valArr = values.map(obj => [${fields.map(f => `obj.${f}`).join(",")}]);
  const [result] = await dbPool.query(q, [valArr]);
  return result.insertId;
}

// Update
async function update(dataArray) {
  const dbPool = getDatabaseConnection("${dbName}");
  const values = Array.isArray(dataArray) ? dataArray : [dataArray];
  for (const obj of values) {
    const q = \`UPDATE ${tableName} SET ${fields.filter(f => f !== primaryKey).map(f => f+'=?').join(',')} WHERE ${primaryKey}=?\`;
    const params = [${fields.filter(f => f !== primaryKey).map(f => `obj.${f}`).join(',')}, obj.${primaryKey}];
    await dbPool.query(q, params);
  }
  return true;
}

// Get all plain
async function getAllPlain() {
  const dbPool = getDatabaseConnection("${dbName}");
  const [rows] = await dbPool.query("SELECT * FROM ${tableName}");
  return rows;
}

module.exports = { getRefNo, getAll, getById, insert, update, getAllPlain };
`;

// -------------------
// Service
// -------------------
const service = `const model = require("./${tableName}.model");

// Read all with filter
async function readAll(filter, limit, offset) {
  try { return await model.getAll(filter, limit, offset); } 
  catch (error) { console.log("Error fetching all ${tableName}: " + error.message); throw error; }
}

// Read plain all
async function readAllPlain() {
  try { return await model.getAllPlain(); }
  catch (error) { console.log("Error fetching all plain ${tableName}: " + error.message); throw error; }
}

// Read single by ID
async function readById(id) {
  try { return await model.getById(id); } 
  catch (error) { console.log("Error fetching ${tableName} by ID: " + error.message); throw error; }
}

// Create new record(s)
async function create(data) {
  try { return await model.insert(data); } 
  catch (error) { console.log("Error inserting into ${tableName}: " + error.message); throw error; }
}

// Update existing record(s)
async function modify(data) {
  try { return await model.update(data); } 
  catch (error) { console.log("Error updating ${tableName}: " + error.message); throw error; }
}

// Get next RefNo
async function getNextRefNo() {
  try { return await model.getRefNo(); }
  catch (error) { console.log("Error getting next RefNo for ${tableName}: " + error.message); throw error; }
}

module.exports = { readAll, readAllPlain, readById, create, modify, getNextRefNo };
`;

// -------------------
// Controller
// -------------------
const controller = `const service = require("./${tableName}.service");

// Get all with filter
async function getAll(req, res) {
  try { const data = await service.readAll(req.body.filter, req.body.limit, req.body.offset); res.json({ data }); } 
  catch (error) { res.status(500).json({ message: error.message }); }
}

// Get all plain
async function getAllPlain(req, res) {
  try { const data = await service.readAllPlain(); res.json({ data }); } 
  catch (error) { res.status(500).json({ message: error.message }); }
}

// Get single by ID
async function getById(req, res) {
  try { const data = await service.readById(req.body.${primaryKey}); res.json({ data }); } 
  catch (error) { res.status(500).json({ message: error.message }); }
}

// Insert
async function insert(req, res) {
  try { const id = await service.create(req.body); res.json({ id }); } 
  catch (error) { res.status(500).json({ message: error.message }); }
}

// Update
async function update(req, res) {
  try { const affected = await service.modify(req.body); res.json({ updated: affected }); } 
  catch (error) { res.status(500).json({ message: error.message }); }
}

// Get next RefNo
async function getRefNo(req, res) {
  try { const nextNo = await service.getNextRefNo(); res.json({ nextNo }); } 
  catch (error) { res.status(500).json({ message: error.message }); }
}

module.exports = { getAll, getAllPlain, getById, insert, update, getRefNo };
`;

// -------------------
// Routes
// -------------------
const routes = `const express = require("express");
const controller = require("./${tableName}.controller");
const router = express.Router();

router.get("/getAllLimit", controller.getAll);
router.get("/getAll", controller.getAllPlain);
router.post("/getSingle", controller.getById);
router.post("/create", controller.insert);
router.post("/update", controller.update);
router.get("/getNextRefNo", controller.getRefNo);

module.exports = router;
`;

// -------------------
// Write backend files
// -------------------
fs.writeFileSync(modelFile, model);
fs.writeFileSync(serviceFile, service);
fs.writeFileSync(controllerFile, controller);
fs.writeFileSync(routeFile, routes);
console.log(`✅ Backend generated for table: ${tableName}`);


  
  // -------------------
  // Frontend Form Generator (unchanged)
  // -------------------
  if (frontend && frontend.fields && frontend.fields.length) {
    const outputHtmlFile = path.join(tableOutputDir, `${tableName}.form.component.html`);
    const outputTsFile = path.join(tableOutputDir, `${tableName}.form.component.ts`);

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
        if (["InputText","InputNumber"].includes(f.primengModule)) {
          const type = f.type === "number" ? "number" : "text";
          html += `        <input type="${type}" class="w-full" pInputText id="${f.fieldName}" formControlName="${f.fieldName}"`;
          if (f.type === "number") html += ` [pattern]="patterns"`;
          html += ` />\n`;
        } else if (f.primengModule === "Select") {
          html += `        <p-select  [(ngModel)]="selected${f.fieldName}" inputId="${f.fieldName}" [options]="${f.fieldName}Options" placeholder="Select" optionLabel="label" class="w-full" formControlName="${f.fieldName}" appendTo="body"></p-select>\n`;
        } else if (f.primengModule === "DatePicker") {
          html += `         <p-datepicker id="${f.fieldName}" formControlName="${f.fieldName}" [showIcon]="true" appendTo="body"/>\n`;
        } else if (f.primengModule === "Textarea") {
          const rows = f.rows || 2;
          const cols = f.cols || 30;
          const style = f.style ? ` style="${f.style}"` : "";
          html += `          <textarea class="w-full" pTextarea id="${f.fieldName}" rows="${rows}" cols="${cols}" formControlName="${f.fieldName}"${style}></textarea>\n`;
        }else if (f.primengModule === "multiselect") {
          html += `        <p-multiSelect [(ngModel)]="selected${f.fieldName}" inputId="${f.fieldName}" [options]="${f.fieldName}Options" placeholder="Select" optionLabel="label" class="w-full" formControlName="${f.fieldName}" appendTo="body"></p-multiSelect>\n`;
        }
        html += `        <label class="iftalabelSize" for="${f.fieldName}">${f.label}</label>\n      </p-iftalabel>\n    </div>\n`;
      });
      html += `  </div>\n`;
    }
    html += `</div>\n  <div class="flex justify-content-end gap-2 mt-4">\n    <button pButton type="submit" label="Submit" [disabled]="${formName}.invalid"></button>\n  </div>\n</form>`;




    // TS
    let ts = `import { Component } from '@angular/core';\nimport { FormGroup, FormControl, Validators } from '@angular/forms';\n\n@Component({\n  selector: 'app-${tableName}-form',\n  templateUrl: './${tableName}.form.component.html',\n  styleUrls: ['./${tableName}.form.component.css']\n})\nexport class ${capitalize(tableName)}FormComponent {\n`;
    ts += `  patterns = "${patterns}";\n\n`;

    ffields.forEach(f => {
      if (f.primengModule === "Select" && f.options) {
        const optionsArray = f.options.map(o => `{ label: '${o}', value: '${o}' }`);
        ts += `  ${f.fieldName}Options = [${optionsArray.join(", ")}];\n`;
        ts += `  selected${f.fieldName}: any;\n \n`;
      }else if(f.primengModule === "multiselect" && f.options){
        const optionsArray = f.options.map(o => `{ label: '${o}', value: '${o}' }`);
        ts += `  ${f.fieldName}Options = [${optionsArray.join(", ")}];\n`;
        ts += `  selected${f.fieldName}: any;\n \n`;
      }
    });

    ts += `  ${formName} = new FormGroup({\n`;
    ffields.forEach(f => {
      let validators = [];
      if (f.required) validators.push("Validators.required");
      if (f.type === "email") validators.push("Validators.email");
      if (f.type === "number") validators.push(`Validators.pattern(this.patterns)`);
      ts += `    ${f.fieldName}: new FormControl<${
        f.type === "number" ? "number | null" : f.type === "date" ? "Date | null" : "string"
      }>(${f.type === "number" || f.type === "date" ? "null" : "''"}${
        validators.length > 0 ? `, { validators: [${validators.join(", ")}] }` : ""
      }),\n`;
    });
    ts += `  });\n}\n`;

    fs.writeFileSync(outputHtmlFile, html, "utf-8");
    fs.writeFileSync(outputTsFile, ts, "utf-8");
    console.log(`✅ Frontend form generated for table: ${tableName}`);
  }
});

console.log("🎉 All backend and frontend code generated successfully!");
