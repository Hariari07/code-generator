const fs = require('fs');
const path = require('path');

// Path to the SQL file
const sqlFile = path.join(__dirname, "../sqlCode/table.sql");

// Function to convert SQL to JSON columns
function sqlToJsonColumns(sql) {
  // Extract table name
  const tableMatch = sql.match(/CREATE TABLE IF NOT EXISTS `.*`\.`(.*)`/i);
  const tableName = tableMatch ? tableMatch[1] : 'unknown_table';

  // Extract column definitions
  const columnsMatch = sql.match(/\(([\s\S]*?)\)\s*ENGINE/i);
  if (!columnsMatch) return null;

  const columnsDef = columnsMatch[1];
  const columnLines = columnsDef.split(/,(?![^(]*\))/);

  const jsonColumns = [];

  columnLines.forEach(line => {
    line = line.trim();
    if (/^(PRIMARY|UNIQUE|FOREIGN|KEY)/i.test(line)) return;

    const parts = line.split(/\s+/);
    const colName = parts[0].replace(/`/g, '');
    const colType = parts[1].toUpperCase();

    let frontendType = 'text';
    if (/INT|BIGINT|DECIMAL|FLOAT|DOUBLE/.test(colType)) frontendType = 'number';
    else if (/DATETIME|TIMESTAMP|DATE/.test(colType)) frontendType = 'datetime';
    else frontendType = 'text';

    jsonColumns.push({
      name: colName,
      label: colName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      type: frontendType,
      sortable: true,
      filterable: true
    });
  });

  return {
    entity: tableName,
    columns: jsonColumns
  };
}

// Read SQL code from the file
fs.readFile(sqlFile, 'utf8', (err, sqlCode) => {
  if (err) {
    console.error("Error reading SQL file:", err);
    return;
  }

  const jsonOutput = sqlToJsonColumns(sqlCode);

//   console.log(JSON.stringify(jsonOutput, null, 2));

  // Optional: save output to a JSON file
  const outputFile = path.join(__dirname, "../outputs/tableInput.json");
  fs.writeFileSync(outputFile, JSON.stringify(jsonOutput, null, 2), 'utf8');
  console.log("Generated JSON saved to:", outputFile);
});