const fs = require("fs");
const path = require("path");

const inputFile = path.join(__dirname, "employeeBank.json");
const outputHtmlFile = path.join(
  __dirname,
  "/output/generated-form.component.html"
);
const outputTsFile = path.join(
  __dirname,
  "/output/generated-form.component.ts"
);

const data = JSON.parse(fs.readFileSync(inputFile, "utf-8"));
const formName = data.formName || "createForm";
const fields = data.fields || [];
const col = data.coloumns;
let div = 0;
// Patterns
const patterns = "^[0-9_-]{10,12}";

// Length check for fields
if (fields.length) {
  div = fields.length / col;
  if (!Number.isInteger(div)) {
    console.log(
      `⚠️ Warning: The number of fields (${fields.length}) is not evenly divisible by the number of columns (${col}). This may affect layout.`
    );
  } else {
    console.log(
      `✅ The number of fields (${fields.length}) is evenly divisible by the number of columns (${col}).`
    );
  }
  console.log(
    `🧮 Each column will have approximately ${Math.ceil(div)} fields.`
  );

  console.log(`🔍 Found ${fields.length} fields to process.`);
}

// -----------------------
// Generate HTML
// -----------------------
let html = `<form [formGroup]="${formName}">\n<div class="grid">\n`;

const fieldsPerCol = Math.ceil(fields.length / col);
for (let c = 0; c < col; c++) {
  html += `  <div class="col">\n`;

  const startIndex = c * fieldsPerCol;
  const endIndex = startIndex + fieldsPerCol;

  fields.slice(startIndex, endIndex).forEach((f) => {
    let requiredLabel = f.required ? "" : "";
    html += `    <div class="mb-2">\n      <p-iftalabel>\n`;

    if (f.primengModule === "InputText" || f.primengModule === "InputNumber") {
      const type = f.type === "number" ? "number" : "text";
      html += `        <input type="${type}" class="w-full" pInputText id="${f.fieldName}" formControlName="${f.fieldName}"`;
      if (f.type === "number") html += ` [pattern]="patterns"`;
      html += ` />\n`;
    } else if (f.primengModule === "Select") {
      html += `        <p-select inputId="${f.fieldName}" [options]="${f.fieldName}Options" placeholder="Select" optionLabel="label" class="w-full" formControlName="${f.fieldName}"></p-select>\n`;
    } else if (f.primengModule === "DatePicker") {
      html += `         <p-datepicker id="${f.fieldName}" formControlName="${f.fieldName}" [showIcon]="true" appendTo="body"/>\n`;
    } // Textarea
    else if (f.primengModule === "Textarea" || f.type === "textarea") {
      const rows = f.rows || 2;
      const cols = f.cols || 30;
      const style = f.style ? ` style="${f.style}"` : "";
      html += `          <textarea class="w-full" pTextarea id="${f.fieldName}" rows="${rows}" cols="${cols}" formControlName="${f.fieldName}"${style}></textarea>\n`;
    }

    html += `        <label class="iftalabelSize" for="${f.fieldName}">${f.label}${requiredLabel}</label>\n      </p-iftalabel>\n    </div>\n`;
  });

  html += `  </div>\n`; // close col
}

html += `</div>\n  <div class="flex justify-content-end gap-2 mt-4">\n    <button pButton type="submit" label="Submit" [disabled]="${formName}.invalid"></button>\n  </div>\n</form>`;

// -----------------------
// Generate TypeScript
// -----------------------
let ts = `import { Component } from '@angular/core';\nimport { FormGroup, FormControl, Validators } from '@angular/forms';\n\n@Component({\n  selector: 'app-generated-form',\n  templateUrl: './generated-form.component.html',\n  styleUrls: ['./generated-form.component.css']\n})\nexport class GeneratedFormComponent {\n`;
ts += `  patterns = "${patterns}";\n\n`;

// Dropdown options
fields.forEach((f) => {
  if (f.primengModule === "Dropdown") {
    const optionsArray = f.options.map(
      (o) => `{ label: '${o}', value: '${o}' }`
    );
    ts += `  ${f.fieldName}Options = [${optionsArray.join(", ")}];\n`;
    ts += `  selected${capitalize(f.fieldName)}: string | null = null;\n\n`;
  }
});

// FormGroup
ts += `  ${formName} = new FormGroup({\n`;
fields.forEach((f) => {
  let validators = [];
  if (f.required) validators.push("Validators.required");
  if (f.type === "email") validators.push("Validators.email");
  if (f.type === "number") validators.push(`Validators.pattern(this.patterns)`);
  ts += `    ${f.fieldName}: new FormControl<${
    f.type === "number"
      ? "number | null"
      : f.type === "date"
      ? "Date | null"
      : "string"
  }>(${f.type === "number" || f.type === "date" ? "null" : "''"}${
    validators.length > 0 ? `, { validators: [${validators.join(", ")}] }` : ""
  }),\n`;
});
ts += `  });\n`;

ts += `}\n`;

// Write files
fs.writeFileSync(outputHtmlFile, html, "utf-8");
fs.writeFileSync(outputTsFile, ts, "utf-8");

console.log("✅ Generated HTML:", outputHtmlFile);
console.log("✅ Generated TS:", outputTsFile);

// -----------------------
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
