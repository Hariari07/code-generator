// generator-global-backend.js
const fs = require("fs");
const path = require("path");

const inputFile = path.join(__dirname, "../inputs/inputGenerator.json");
const outputDir = path.join(__dirname, "../outputs/generatedCode2/");

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const tables = JSON.parse(fs.readFileSync(inputFile, "utf-8"));
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

tables.forEach((tbl) => {
  const { tableName, dbName, primaryKey, fields = [] } = tbl;

  if (!tableName || !fields.length || !primaryKey) {
    console.warn(`⚠ Skipping table due to missing info: ${tableName}`);
    return;
  }

  const tableDir = path.join(outputDir, tableName);
  if (!fs.existsSync(tableDir)) fs.mkdirSync(tableDir, { recursive: true });

  const modelFields = fields.filter((f) => f !== primaryKey);

  // -----------------------
  // MODEL
  // -----------------------
  const modelContent = `const getDatabaseConnection = require("../../../config/db");

async function getAll${capitalize(tableName)}() {
  const dbPool = getDatabaseConnection("${dbName}");
  const [rows] = await dbPool.query("SELECT ${fields.join(", ")} FROM ${tableName} ORDER BY ${primaryKey} DESC");
  return rows;
}

async function getById${capitalize(tableName)}(id) {
  const dbPool = getDatabaseConnection("${dbName}");
  const [rows] = await dbPool.query("SELECT ${fields.join(", ")} FROM ${tableName} WHERE ${primaryKey}=?", [id]);
  return rows[0];
}

async function insert${capitalize(tableName)}(data) {
  const dbPool = getDatabaseConnection("${dbName}");
  const values = [${modelFields.map(f => `data.${f}`).join(", ")}];
  const query = "INSERT INTO ${tableName} (${modelFields.join(", ")}) VALUES (?)";
  const [result] = await dbPool.query(query, [values]);
  return result.insertId;
}

async function update${capitalize(tableName)}(id, data) {
  const dbPool = getDatabaseConnection("${dbName}");
  const query = "UPDATE ${tableName} SET ${modelFields.map(f => f+"=?").join(", ")} WHERE ${primaryKey}=?";
  const values = [${modelFields.map(f => `data.${f}`).join(", ")}, id];
  await dbPool.query(query, values);
  return true;
}

module.exports = { getAll${capitalize(tableName)}, getById${capitalize(tableName)}, insert${capitalize(tableName)}, update${capitalize(tableName)} };
`;

  fs.writeFileSync(path.join(tableDir, `${tableName}.model.js`), modelContent, "utf-8");

  // -----------------------
  // SERVICE
  // -----------------------
  const serviceContent = `const model = require("./${tableName}.model");

// Generic service for CRUD
async function getAll${capitalize(tableName)}() { return model.getAll${capitalize(tableName)}(); }
async function getById${capitalize(tableName)}(id) { return model.getById${capitalize(tableName)}(id); }
async function create${capitalize(tableName)}(data) { return model.insert${capitalize(tableName)}(data); }
async function update${capitalize(tableName)}(id, data) { return model.update${capitalize(tableName)}(id, data); }

module.exports = { getAll${capitalize(tableName)}, getById${capitalize(tableName)}, create${capitalize(tableName)}, update${capitalize(tableName)} };
`;

  fs.writeFileSync(path.join(tableDir, `${tableName}.service.js`), serviceContent, "utf-8");

  // -----------------------
  // CONTROLLER
  // -----------------------
  const controllerContent = `const service = require("./${tableName}.service");

// Controller handles req.body.data
async function getAll${capitalize(tableName)}(req, res) {
  try {
    const data = await service.getAll${capitalize(tableName)}();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getById${capitalize(tableName)}(req, res) {
  try {
    const id = req.body.${primaryKey};
    const data = await service.getById${capitalize(tableName)}(id);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function create${capitalize(tableName)}(req, res) {
  try {
    const data = req.body.data; // generic
    const id = await service.create${capitalize(tableName)}(data);
    res.status(201).json({ message: "success", id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function update${capitalize(tableName)}(req, res) {
  try {
    const data = req.body.data;
    const id = req.body.${primaryKey};
    await service.update${capitalize(tableName)}(id, data);
    res.json({ message: "success" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getAll${capitalize(tableName)}, getById${capitalize(tableName)}, create${capitalize(tableName)}, update${capitalize(tableName)} };
`;

  fs.writeFileSync(path.join(tableDir, `${tableName}.controller.js`), controllerContent, "utf-8");

  // -----------------------
  // ROUTES
  // -----------------------
  const routesContent = `const express = require("express");
const controller = require("./${tableName}.controller");
const router = express.Router();

router.get("/all", controller.getAll${capitalize(tableName)});
router.post("/single", controller.getById${capitalize(tableName)});
router.post("/create", controller.create${capitalize(tableName)});
router.post("/update", controller.update${capitalize(tableName)});

module.exports = router;
`;

  fs.writeFileSync(path.join(tableDir, `${tableName}.routes.js`), routesContent, "utf-8");

  console.log(`✅ Generated full CRUD backend for table: ${tableName}`);
});

console.log("🎉 All backend files generated successfully!");