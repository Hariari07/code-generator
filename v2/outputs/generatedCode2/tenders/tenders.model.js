const getDatabaseConnection = require("../../../config/db");

async function getAllTenders() {
  const dbPool = getDatabaseConnection("default");
  const [rows] = await dbPool.query("SELECT id, companyId, subCategoryId, tittle, description, location, deadLine, tenderStatus, createdAt, updatedAt FROM tenders ORDER BY id DESC");
  return rows;
}

async function getByIdTenders(id) {
  const dbPool = getDatabaseConnection("default");
  const [rows] = await dbPool.query("SELECT id, companyId, subCategoryId, tittle, description, location, deadLine, tenderStatus, createdAt, updatedAt FROM tenders WHERE id=?", [id]);
  return rows[0];
}

async function insertTenders(data) {
  const dbPool = getDatabaseConnection("default");
  const values = [data.companyId, data.subCategoryId, data.tittle, data.description, data.location, data.deadLine, data.tenderStatus, data.createdAt, data.updatedAt];
  const query = "INSERT INTO tenders (companyId, subCategoryId, tittle, description, location, deadLine, tenderStatus, createdAt, updatedAt) VALUES (?)";
  const [result] = await dbPool.query(query, [values]);
  return result.insertId;
}

async function updateTenders(id, data) {
  const dbPool = getDatabaseConnection("default");
  const query = "UPDATE tenders SET companyId=?, subCategoryId=?, tittle=?, description=?, location=?, deadLine=?, tenderStatus=?, createdAt=?, updatedAt=? WHERE id=?";
  const values = [data.companyId, data.subCategoryId, data.tittle, data.description, data.location, data.deadLine, data.tenderStatus, data.createdAt, data.updatedAt, id];
  await dbPool.query(query, values);
  return true;
}

module.exports = { getAllTenders, getByIdTenders, insertTenders, updateTenders };
