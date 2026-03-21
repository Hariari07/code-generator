const getDatabaseConnection = require("../../../config/db");

// -----------------------
// Get Next Ref No
// -----------------------
async function getRefNouserProfile() {
  const dbPool = getDatabaseConnection("hlmmasters");
  const [rows] = await dbPool.query(
    "SELECT IFNULL(MAX(id),0)+1 AS nextNo FROM userProfile"
  );
  return rows[0].nextNo.toString().padStart(5, "0");
}

// -----------------------
// Pagination + Filter
// -----------------------
async function getAllPaginateduserProfile(page, size, sortField, sortOrder, filters) {
  const dbPool = getDatabaseConnection("hlmmasters");

  let whereClause = "WHERE 1=1";
  const values = [];

  const allowedFields = ["userId","companyName","address1","address2","city","state","country","pinCode","latitude","longitude","contactNo","emailid","currencyCode","profileImageUrl"];

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
    SELECT userId,companyName,address1,address2,city,state,country,pinCode,latitude,longitude,contactNo,emailid,currencyCode,profileImageUrl
    FROM userProfile
    ${whereClause}
    ORDER BY ${safeSort} ${order}
    LIMIT ? OFFSET ?
  `;

  values.push(size, offset);

  const [data] = await dbPool.query(query, values);
  const [[{ total }]] = await dbPool.query(
    `SELECT COUNT(*) total FROM userProfile ${whereClause}`,
    values.slice(0, -2)
  );

  return { data, total };
}

// -----------------------
// Get All
// -----------------------
async function getAllPlainuserProfile() {
  const dbPool = getDatabaseConnection("hlmmasters");
  const [rows] = await dbPool.query(
    "SELECT userId,companyName,address1,address2,city,state,country,pinCode,latitude,longitude,contactNo,emailid,currencyCode,profileImageUrl FROM userProfile ORDER BY id DESC"
  );
  return rows;
}

// -----------------------
// Get By ID
// -----------------------
async function getByIduserProfile(id) {
  const dbPool = getDatabaseConnection("hlmmasters");
  const [rows] = await dbPool.query(
    "SELECT userId,companyName,address1,address2,city,state,country,pinCode,latitude,longitude,contactNo,emailid,currencyCode,profileImageUrl FROM userProfile WHERE id=?",
    [id]
  );
  return rows[0];
}

// -----------------------
// Exists
// -----------------------
async function checkEmployeeCodeExistsuserProfile(id) {
  const dbPool = getDatabaseConnection("hlmmasters");
  const [rows] = await dbPool.query(
    "SELECT 1 FROM userProfile WHERE id=?",
    [id]
  );
  return rows.length > 0;
}

// -----------------------
// Insert
// -----------------------
async function insertuserProfile(data) {
  const dbPool = getDatabaseConnection("hlmmasters");
  const q = `INSERT INTO userProfile (userId,companyName,address1,address2,city,state,country,pinCode,latitude,longitude,contactNo,emailid,currencyCode,profileImageUrl) VALUES (?)`;
  const values = [data.userId,data.companyName,data.address1,data.address2,data.city,data.state,data.country,data.pinCode,data.latitude,data.longitude,data.contactNo,data.emailid,data.currencyCode,data.profileImageUrl];
  const [result] = await dbPool.query(q, [values]);
  return result.insertId;
}

// -----------------------
// Update
// -----------------------
async function updateuserProfile(id, data) {
  const dbPool = getDatabaseConnection("hlmmasters");
  const setClause = "userId=?,companyName=?,address1=?,address2=?,city=?,state=?,country=?,pinCode=?,latitude=?,longitude=?,contactNo=?,emailid=?,currencyCode=?,profileImageUrl=?";

  const values = [data.userId,data.companyName,data.address1,data.address2,data.city,data.state,data.country,data.pinCode,data.latitude,data.longitude,data.contactNo,data.emailid,data.currencyCode,data.profileImageUrl , id];

  await dbPool.query(
    `UPDATE userProfile SET ${setClause} WHERE id=?`,
    values
  );
  return true;
}

module.exports = {
  getRefNouserProfile,
  getAllPaginateduserProfile,
  getAllPlainuserProfile,
  getByIduserProfile,
  checkEmployeeCodeExistsuserProfile,
  insertuserProfile,
  updateuserProfile
};
