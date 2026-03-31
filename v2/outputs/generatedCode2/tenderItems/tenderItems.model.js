const getDatabaseConnection = require("../../../config/db");

async function getAllTenderItems() {
  const dbPool = getDatabaseConnection("default");
  const [rows] = await dbPool.query("SELECT itemName, specification, quantity, unitId, remarks FROM tenderItems ORDER BY id DESC");
  return rows;
}

async function getByIdTenderItems(id) {
  const dbPool = getDatabaseConnection("default");
  const [rows] = await dbPool.query("SELECT itemName, specification, quantity, unitId, remarks FROM tenderItems WHERE id=?", [id]);
  return rows[0];
}

async function insertTenderItems(data) {
  const dbPool = getDatabaseConnection("default");
  const values = [data.itemName, data.specification, data.quantity, data.unitId, data.remarks];
  const query = "INSERT INTO tenderItems (itemName, specification, quantity, unitId, remarks) VALUES (?)";
  const [result] = await dbPool.query(query, [values]);
  return result.insertId;
}

async function updateTenderItems(id, data) {
  const dbPool = getDatabaseConnection("default");
  const query = "UPDATE tenderItems SET itemName=?, specification=?, quantity=?, unitId=?, remarks=? WHERE id=?";
  const values = [data.itemName, data.specification, data.quantity, data.unitId, data.remarks, id];
  await dbPool.query(query, values);
  return true;
}

module.exports = { getAllTenderItems, getByIdTenderItems, insertTenderItems, updateTenderItems };
