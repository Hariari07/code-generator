const fs = require("fs");
const path = require("path");

const inputFile = path.join(__dirname, "../inputs/backend-tables.json");
const outputDir = path.join(__dirname, "../output/backend");

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const tables = JSON.parse(fs.readFileSync(inputFile, "utf-8"));

tables.forEach(table => {
  const { tableName, dbName, primaryKey, fields } = table;
  const nonPKFields = fields.filter(f => f !== primaryKey);
  const tableDir = outputDir;

  // ------------------- MODEL -------------------
  let modelContent = `
const getDatabaseConnection = require("../../../config/db");

// RefNo
async function getRefNo() {
  const dbPool = getDatabaseConnection("${dbName}");
  const q = "SELECT IFNULL(MAX(${primaryKey}),0)+1 as nextNo FROM ${tableName}";
  const [rows] = await dbPool.query(q);
  return rows[0].nextNo.toString().padStart(5,"0");
}

// Get all with optional filter & pagination
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

// Get single record by ID
async function getSingle(id) {
  const dbPool = getDatabaseConnection("${dbName}");
  const [rows] = await dbPool.query("SELECT * FROM ${tableName} WHERE ${primaryKey} = ?", [id]);
  return rows[0];
}

// Insert record(s)
async function insert(dataArray) {
  const dbPool = getDatabaseConnection("${dbName}");
  const values = Array.isArray(dataArray) ? dataArray : [dataArray];
  const q = "INSERT INTO ${tableName} (${nonPKFields.join(",")}) VALUES ?";
  const valArr = values.map(obj => [${nonPKFields.map(f => `obj.${f}`).join(",")}]);
  const [result] = await dbPool.query(q, [valArr]);
  return result.insertId;
}

// Update record(s)
async function update(dataArray) {
  const dbPool = getDatabaseConnection("${dbName}");
  const values = Array.isArray(dataArray) ? dataArray : [dataArray];
  for (const obj of values) {
    const q = \`UPDATE ${tableName} SET ${nonPKFields.map(f => f+"=?").join(",")} WHERE ${primaryKey}=?\`;
    const params = [${nonPKFields.map(f => `obj.${f}`).join(",")}, obj.${primaryKey}];
    await dbPool.query(q, params);
  }
  return true;
}
`;

  // ✅ Special: Employees table - getAllEmployees
  if (tableName === "employees") {
    modelContent += `

// Get all employees (special)
async function getAllEmployees() {
  const dbPool = getDatabaseConnection("${dbName}");
  const [rows] = await dbPool.query("SELECT * FROM ${tableName}");
  return rows;
}
`;
  }

  modelContent += `\nmodule.exports = { getRefNo, getAll, getSingle, insert, update${tableName==="employees"?", getAllEmployees":""} };`;

  // ------------------- SERVICE -------------------
  let serviceContent = `
const model = require("../../../models/hr/master/${tableName}.model");

async function fetchRefNo() { return await model.getRefNo(); }
async function fetchAll(filter, limit, offset) { return await model.getAll(filter, limit, offset); }
async function fetchSingle(id) { return await model.getSingle(id); }
async function add(data) { return await model.insert(data); }
async function modify(data) { return await model.update(data); }
`;

  if (tableName === "employees") {
    serviceContent += `
async function fetchAllEmployees() { return await model.getAllEmployees(); }
`;
  }

  serviceContent += `\nmodule.exports = { fetchRefNo, fetchAll, fetchSingle, add, modify${tableName==="employees"?", fetchAllEmployees":""} };`;

  // ------------------- CONTROLLER -------------------
  let controllerContent = `
const service = require("../../../services/hr/master/${tableName}.service");

async function getRefNo(req,res){
  try{ const data = await service.fetchRefNo(); res.json({ data }); }
  catch(e){ console.log(e.message); res.status(500).json({ message: "Internal Server Error" }); }
}

async function getAll(req,res){
  try{ const { filter = {}, limit = 100, offset = 0 } = req.body;
       const data = await service.fetchAll(filter, limit, offset);
       res.json({ data }); }
  catch(e){ console.log(e.message); res.status(500).json({ message: "Internal Server Error" }); }
}

async function getSingle(req,res){
  try{ const { id } = req.body;
       const data = await service.fetchSingle(id);
       res.json({ data }); }
  catch(e){ console.log(e.message); res.status(500).json({ message: "Internal Server Error" }); }
}

async function add(req,res){
  try{ const data = req.body; const id = await service.add(data); res.json({ id }); }
  catch(e){ console.log(e.message); res.status(500).json({ message: "Internal Server Error" }); }
}

async function update(req,res){
  try{ const data = req.body; const result = await service.modify(data); res.json({ updated: result }); }
  catch(e){ console.log(e.message); res.status(500).json({ message: "Internal Server Error" }); }
}
`;

  if (tableName === "employees") {
    controllerContent += `
async function getAllEmployees(req,res){
  try{ const data = await service.fetchAllEmployees(); res.json({ data }); }
  catch(e){ console.log(e.message); res.status(500).json({ message: "Internal Server Error" }); }
}
`;
  }

  controllerContent += `\nmodule.exports = { getRefNo, getAll, getSingle, add, update${tableName==="employees"?", getAllEmployees":""} };`;

  // ------------------- ROUTES -------------------
  let routesContent = `
const express = require("express");
const controller = require("../../../controllers/hr/master/${tableName}.controller");
const router = express.Router();

router.post("/refno", controller.getRefNo);
router.post("/all", controller.getAll);
router.post("/single", controller.getSingle);
router.post("/add", controller.add);
router.post("/update", controller.update);
`;

  if (tableName === "employees") {
    routesContent += `router.post("/all-employees", controller.getAllEmployees);\n`;
  }

  routesContent += "\nmodule.exports = router;";

  // ------------------- WRITE FILES -------------------
  fs.writeFileSync(path.join(tableDir, `${tableName}.model.js`), modelContent.trim());
  fs.writeFileSync(path.join(tableDir, `${tableName}.service.js`), serviceContent.trim());
  fs.writeFileSync(path.join(tableDir, `${tableName}.controller.js`), controllerContent.trim());
  fs.writeFileSync(path.join(tableDir, `${tableName}.routes.js`), routesContent.trim());

  console.log(`✅ Generated backend for table: ${tableName}`);
});

console.log("\n🎉 All backend code generated successfully!");
