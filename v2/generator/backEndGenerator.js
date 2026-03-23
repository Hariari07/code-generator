// generator-service-transform.js
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const inputFile = path.join(__dirname, "../inputs/inputGenerator.json");
const outputDir = path.join(__dirname, "../outputs/generatedCode");

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const tables = JSON.parse(fs.readFileSync(inputFile, "utf-8"));
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

tables.forEach((tbl) => {
  const { tableName, dbName, primaryKey, fields = [] } = tbl;

  if (!tableName || !fields.length) return;

  const tableDir = path.join(outputDir, tableName);
  if (!fs.existsSync(tableDir)) fs.mkdirSync(tableDir, { recursive: true });

  const modelFields = fields.filter((f) => f !== primaryKey);

  // -----------------------
  // MODEL (standard CRUD)
  // -----------------------
  const modelContent = `const getDatabaseConnection = require("../../../config/db");


async function insertUserProfile(data) {
    try {
      	
	const dbPool = getDatabaseConnection("${dbName}");
  	const values = [${modelFields.map(f => `data.${f}`).join(", ")}];
  	const query = "INSERT INTO ${tableName} (${modelFields.join(", ")}) VALUES (?)";
  	const [result] = await dbPool.query(query, [values]);


        return {
            success: true,
            insertId: result.insertId,
            message: "User profile inserted successfully"
        };

    } catch (error) {
        console.error("Insert Error:", error);

        return {
            success: false,
            insertId: null,
            message: "Failed to insert user profile",
            error: error.message
        };
    }
}

module.exports = { insert${capitalize(tableName)} };
`;
  fs.writeFileSync(path.join(tableDir, `${tableName}.model.js`), modelContent, "utf-8");

  // -----------------------
  // SERVICE (with transform & hash snippet)
  // -----------------------
  let serviceContent = `const model = require("./${tableName}.model");
const bcrypt = require("bcryptjs");

// Prepare finalData and insert
async function create${capitalize(tableName)}(data) {
  const recData = data.data || data;    

  const finalData = {
    ${modelFields.map(f => {
    if (f.includes("branchName")) return `${f}: recData.${f}.value || recData.${f}`;
    return `${f}: recData.${f}`;
  }).join(",\n    ")}
  };

  return await model.insert${capitalize(tableName)}(finalData);
}

module.exports = { create${capitalize(tableName)} };
`;

  fs.writeFileSync(path.join(tableDir, `${tableName}.service.js`), serviceContent, "utf-8");

  // -----------------------
  // CONTROLLER (extract data & call service)
  // -----------------------
  const controllerContent = `const service = require("./${tableName}.service");

async function create${capitalize(tableName)}(req, res) {
  try {
    const data = req.body.data;
    const result = await service.create${capitalize(tableName)}({ data });
    res.status(201).json({ message: "success", id: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { create${capitalize(tableName)} };
`;

  fs.writeFileSync(path.join(tableDir, `${tableName}.controller.js`), controllerContent, "utf-8");

  // -----------------------
  // ROUTES
  // -----------------------
  const routesContent = `const express = require("express");
const controller = require("./${tableName}.controller");
const router = express.Router();

router.post("/create", controller.create${capitalize(tableName)});

module.exports = router;
`;

  fs.writeFileSync(path.join(tableDir, `${tableName}.routes.js`), routesContent, "utf-8");

  console.log(`✅ Generated ${tableName} backend with transform & hash method.`);
});

console.log("🎉 All backend files generated successfully!");