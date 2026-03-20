const fs = require("fs");
const path = require("path");

// Config
const inputFile = path.join(__dirname, "../inputs/inputGenerator.json");
const outputDir = path.join(__dirname, "../outputs/generatedCode/snippets");

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

// Read JSON
let tables;
try {
  const jsonStr = fs.readFileSync(inputFile, "utf-8");
  tables = JSON.parse(jsonStr);
} catch (err) {
  console.error("❌ Failed to read/parse JSON:", err.message);
  process.exit(1);
}

// Helper
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Generate Snippets
tables.forEach((tbl) => {
  const { tableName, fields = [] } = tbl;
  if (!tableName || fields.length === 0) return;

  const tableDir = path.join(outputDir, tableName);
  if (!fs.existsSync(tableDir)) fs.mkdirSync(tableDir, { recursive: true });

  // -----------------------
  // Generate Controller Snippet
  // -----------------------
  let controllerSnippet = `// Controller Snippet for table: ${tableName}\n`;
  controllerSnippet += `const data = req.body.data;\n`;
  fields.forEach((f) => {
    controllerSnippet += `const ${f} = data.${f};\n`;
  });

  fs.writeFileSync(path.join(tableDir, `${tableName}.controller.snippet.js`), controllerSnippet, "utf-8");

  // -----------------------
  // Generate Service Snippet
  // -----------------------
  let serviceSnippet = `// Service Snippet for table: ${tableName}\n`;
  fields.forEach((f) => {
    serviceSnippet += `const ${f} = payload.${f};\n`;
  });

  fs.writeFileSync(path.join(tableDir, `${tableName}.service.snippet.js`), serviceSnippet, "utf-8");

  console.log(`✅ Snippets generated for table: ${tableName}`);
});

console.log("🎉 All snippets generated successfully!");