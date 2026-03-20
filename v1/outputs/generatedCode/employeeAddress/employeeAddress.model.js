const getDatabaseConnection = require("../../../config/db");

// Get next RefNo
async function getRefNo() {
  const dbPool = getDatabaseConnection("hlmmasters");
  const q = "SELECT IFNULL(MAX(id),0)+1 as nextNo FROM employeeAddress";
  const [rows] = await dbPool.query(q);
  return rows[0].nextNo.toString().padStart(5,"0");
}

// Get all
async function getAll(filter = {}, limit = 100, offset = 0) {
  const dbPool = getDatabaseConnection("hlmmasters");
  let query = "SELECT * FROM employeeAddress WHERE 1=1";
  const params = [];
  for (const key in filter) {
    query += ` AND ${key} = ?`;
    params.push(filter[key]);
  }
  query += " ORDER BY id DESC LIMIT ? OFFSET ?";
  params.push(limit, offset);
  const [rows] = await dbPool.query(query, params);
  return rows;
}

// Get single record
async function getById(id) {
  const dbPool = getDatabaseConnection("hlmmasters");
  const [rows] = await dbPool.query("SELECT * FROM employeeAddress WHERE id = ?", [id]);
  return rows[0];
}

// Insert
async function insert(dataArray) {
  const dbPool = getDatabaseConnection("hlmmasters");
  const values = Array.isArray(dataArray) ? dataArray : [dataArray];
  const q = "INSERT INTO employeeAddress (id,employeeCode,addressType,addressLine1,addressLine2,city,state,pinCode,country) VALUES ?";
  const valArr = values.map(obj => [obj.id,obj.employeeCode,obj.addressType,obj.addressLine1,obj.addressLine2,obj.city,obj.state,obj.pinCode,obj.country]);
  const [result] = await dbPool.query(q, [valArr]);
  return result.insertId;
}

// Update
async function update(dataArray) {
  const dbPool = getDatabaseConnection("hlmmasters");
  const values = Array.isArray(dataArray) ? dataArray : [dataArray];
  for (const obj of values) {
    const q = `UPDATE employeeAddress SET employeeCode=?,addressType=?,addressLine1=?,addressLine2=?,city=?,state=?,pinCode=?,country=? WHERE id=?`;
    const params = [obj.employeeCode,obj.addressType,obj.addressLine1,obj.addressLine2,obj.city,obj.state,obj.pinCode,obj.country, obj.id];
    await dbPool.query(q, params);
  }
  return true;
}

// Get all plain
async function getAllPlain() {
  const dbPool = getDatabaseConnection("hlmmasters");
  const [rows] = await dbPool.query("SELECT * FROM employeeAddress");
  return rows;
}

module.exports = { getRefNo, getAll, getById, insert, update, getAllPlain };
