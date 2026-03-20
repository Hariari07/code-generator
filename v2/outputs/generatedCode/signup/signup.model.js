const getDatabaseConnection = require("../../../config/db");

// -----------------------
// Get Next Ref No
// -----------------------
async function getRefNosignup() {
  const dbPool = getDatabaseConnection("hlmmasters");
  const [rows] = await dbPool.query(
    "SELECT IFNULL(MAX(id),0)+1 AS nextNo FROM signup"
  );
  return rows[0].nextNo.toString().padStart(5, "0");
}

// -----------------------
// Pagination + Filter
// -----------------------
async function getAllPaginatedsignup(page, size, sortField, sortOrder, filters) {
  const dbPool = getDatabaseConnection("hlmmasters");

  let whereClause = "WHERE 1=1";
  const values = [];

  const allowedFields = ["idsignup","branchName","userName","password","emailid","referalCode","activeStatus"];

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
    SELECT idsignup,branchName,userName,password,emailid,referalCode,activeStatus
    FROM signup
    ${whereClause}
    ORDER BY ${safeSort} ${order}
    LIMIT ? OFFSET ?
  `;

  values.push(size, offset);

  const [data] = await dbPool.query(query, values);
  const [[{ total }]] = await dbPool.query(
    `SELECT COUNT(*) total FROM signup ${whereClause}`,
    values.slice(0, -2)
  );

  return { data, total };
}

// -----------------------
// Get All
// -----------------------
async function getAllPlainsignup() {
  const dbPool = getDatabaseConnection("hlmmasters");
  const [rows] = await dbPool.query(
    "SELECT idsignup,branchName,userName,password,emailid,referalCode,activeStatus FROM signup ORDER BY id DESC"
  );
  return rows;
}

// -----------------------
// Get By ID
// -----------------------
async function getByIdsignup(id) {
  const dbPool = getDatabaseConnection("hlmmasters");
  const [rows] = await dbPool.query(
    "SELECT idsignup,branchName,userName,password,emailid,referalCode,activeStatus FROM signup WHERE id=?",
    [id]
  );
  return rows[0];
}

// -----------------------
// Exists
// -----------------------
async function signupExists(id) {
  const dbPool = getDatabaseConnection("hlmmasters");
  const [rows] = await dbPool.query(
    "SELECT 1 FROM signup WHERE id=?",
    [id]
  );
  return rows.length > 0;
}

// -----------------------
// Insert
// -----------------------
async function insertsignup(data) {
  const dbPool = getDatabaseConnection("hlmmasters");
  const q = `INSERT INTO signup (idsignup,branchName,userName,password,emailid,referalCode,activeStatus) VALUES (?)`;
  const values = [data.idsignup,data.branchName,data.userName,data.password,data.emailid,data.referalCode,data.activeStatus];
  const [result] = await dbPool.query(q, [values]);
  return result.insertId;
}

// -----------------------
// Update
// -----------------------
async function updatesignup(id, data) {
  const dbPool = getDatabaseConnection("hlmmasters");
  const setClause = "idsignup=?,branchName=?,userName=?,password=?,emailid=?,referalCode=?,activeStatus=?";

  const values = [data.idsignup,data.branchName,data.userName,data.password,data.emailid,data.referalCode,data.activeStatus , id];

  await dbPool.query(
    `UPDATE signup SET ${setClause} WHERE id=?`,
    values
  );
  return true;
}

module.exports = {
  getRefNosignup,
  getAllPaginatedsignup,
  getAllPlainsignup,
  getByIdsignup,
  signupExists,
  insertsignup,
  updatesignup
};
