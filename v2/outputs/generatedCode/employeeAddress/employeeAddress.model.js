const getDatabaseConnection = require("../../../config/db");

// -----------------------
// Get Next Ref No
// -----------------------
async function getRefNoemployeeAddress() {
  const dbPool = getDatabaseConnection("hlmmasters");
  const [rows] = await dbPool.query(
    "SELECT IFNULL(MAX(id),0)+1 AS nextNo FROM employeeAddress"
  );
  return rows[0].nextNo.toString().padStart(5, "0");
}

// -----------------------
// Pagination + Filter
// -----------------------
async function getAllPaginatedemployeeAddress(page, size, sortField, sortOrder, filters) {
  const dbPool = getDatabaseConnection("hlmmasters");

  let whereClause = "WHERE 1=1";
  const values = [];

  const allowedFields = ["employeeCode","addressType","addressLine1","addressLine2","city","state","pinCode","country"];

  for (const key in filters) {
    if (!allowedFields.includes(key)) continue;

    const { value, matchMode } = filters[key];
    if (value === null || value === undefined) continue;

    switch (matchMode) {
      case "equals":
        whereClause += ` AND ${key} = ?`;
        values.push(value);
        break;
      case "contains":
        whereClause += ` AND ${key} LIKE ?`;
        values.push(`%\${value}%`);
        break;
      case "startsWith":
        whereClause += ` AND ${key} LIKE ?`;
        values.push(`\${value}%`);
        break;
      case "endsWith":
        whereClause += ` AND ${key} LIKE ?`;
        values.push(`%\${value}`);
        break;
    }
  }

  const safeSort = allowedFields.includes(sortField)
    ? sortField
    : "id";

  const order = sortOrder === 1 ? "ASC" : "DESC";
  const offset = page * size;

  const query = `
    SELECT employeeCode,addressType,addressLine1,addressLine2,city,state,pinCode,country
    FROM employeeAddress
    ${whereClause}
    ORDER BY ${safeSort} ${order}
    LIMIT ? OFFSET ?
  `;

  values.push(size, offset);

  const [data] = await dbPool.query(query, values);
  const [[{ total }]] = await dbPool.query(
    `SELECT COUNT(*) total FROM employeeAddress ${whereClause}`,
    values.slice(0, -2)
  );

  return { data, total };
}

// -----------------------
// Get All
// -----------------------
async function getAllPlainemployeeAddress() {
  const dbPool = getDatabaseConnection("hlmmasters");
  const [rows] = await dbPool.query(
    "SELECT employeeCode,addressType,addressLine1,addressLine2,city,state,pinCode,country FROM employeeAddress ORDER BY id DESC"
  );
  return rows;
}

// -----------------------
// Get By ID
// -----------------------
async function getByIdemployeeAddress(id) {
  const dbPool = getDatabaseConnection("hlmmasters");
  const [rows] = await dbPool.query(
    "SELECT employeeCode,addressType,addressLine1,addressLine2,city,state,pinCode,country FROM employeeAddress WHERE id=?",
    [id]
  );
  return rows[0];
}

// -----------------------
// Exists
// -----------------------
async function employeeAddressExists(id) {
  const dbPool = getDatabaseConnection("hlmmasters");
  const [rows] = await dbPool.query(
    "SELECT 1 FROM employeeAddress WHERE id=?",
    [id]
  );
  return rows.length > 0;
}

// -----------------------
// Insert
// -----------------------
async function insertemployeeAddress(data) {
  const dbPool = getDatabaseConnection("hlmmasters");
  const q = `INSERT INTO employeeAddress (employeeCode,addressType,addressLine1,addressLine2,city,state,pinCode,country) VALUES (?)`;
  const values = [data.employeeCode,data.addressType,data.addressLine1,data.addressLine2,data.city,data.state,data.pinCode,data.country];
  const [result] = await dbPool.query(q, [values]);
  return result.insertId;
}

// -----------------------
// Update
// -----------------------
async function updateemployeeAddress(id, data) {
  const dbPool = getDatabaseConnection("hlmmasters");
  const setClause = "employeeCode=?,addressType=?,addressLine1=?,addressLine2=?,city=?,state=?,pinCode=?,country=?";

  const values = [data.employeeCode,data.addressType,data.addressLine1,data.addressLine2,data.city,data.state,data.pinCode,data.country , id];

  await dbPool.query(
    `UPDATE employeeAddress SET ${setClause} WHERE id=?`,
    values
  );
  return true;
}

module.exports = {
  getRefNoemployeeAddress,
  getAllPaginatedemployeeAddress,
  getAllPlainemployeeAddress,
  getByIdemployeeAddress,
  employeeAddressExists,
  insertemployeeAddress,
  updateemployeeAddress
};
