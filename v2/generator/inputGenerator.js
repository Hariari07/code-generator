const fs = require("fs");
const path = require("path");

// NOTE Change the url frontend as per requirement
const frotEndUrl = "/tender/";

const sqlFile = path.join(__dirname, "../sqlCode/table.sql");
const sqlText = fs.readFileSync(sqlFile, "utf-8");

// Match all CREATE TABLE blocks
const tableRegex = /CREATE TABLE IF NOT EXISTS\s+`([^`]+)`\.`([^`]+)`\s*\(([\s\S]*?)\)\s*ENGINE\s*=\s*InnoDB/g;
const matches = [...sqlText.matchAll(tableRegex)];

const output = [];

matches.forEach(match => {
  const dbName = match[1];
  const tableName = match[2];
  const columnsText = match[3];

  // Split columns by comma at line end, ignoring commas inside parentheses
  const columnLines = columnsText.split(/\n/).filter(line => line.trim() && !line.toLowerCase().includes("primary key"));

  const fields = columnLines.map(line => {
    const colMatch = line.match(/`([^`]+)`/);
    return colMatch ? colMatch[1] : null;
  }).filter(f => f); // remove null

  // Generate frontend sample fields
const frontendFields = fields
  .filter(f => ![`id`, `preparedBy`, `preparedAt`, `approvedBy`, `approvedAt`, `stage`].includes(f))
  .map(f => {
    let type = "text";
    if (f.toLowerCase().includes("code") || f.toLowerCase().includes("contact")) type = "number";
    if (f.toLowerCase().includes("date")) type = "date";
    return {
      fieldName: f,
      label: f.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase()),
      type,
      primengModule: type === "number" ? "InputNumber" : type === "date" ? "DatePicker" : "InputText",
      required: true
    };
  });


  output.push({
    tableName,
    dbName,
    primaryKey: "id",
    fields,
    frontEndCommanUrl: frotEndUrl,
    frontend: {
      formName: tableName + "Form",
      columns: 2,
      fields: frontendFields
    }
  });
});

fs.writeFileSync(path.join(__dirname, "../inputs/inputGenerator.json"), JSON.stringify(output, null, 2), "utf-8");
console.log("✅ JSON generated successfully!");
