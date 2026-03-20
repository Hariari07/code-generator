const getDatabaseConnection = require("../../../config/db");

async function getAllSignup() {
  const dbPool = getDatabaseConnection("hlmmasters");
  const [rows] = await dbPool.query("SELECT idsignup, branchName, userName, password, emailid, referalCode, activeStatus FROM signup ORDER BY id DESC");
  return rows;
}

async function getByIdSignup(id) {
  const dbPool = getDatabaseConnection("hlmmasters");
  const [rows] = await dbPool.query("SELECT idsignup, branchName, userName, password, emailid, referalCode, activeStatus FROM signup WHERE id=?", [id]);
  return rows[0];
}

async function insertSignup(data) {
  const dbPool = getDatabaseConnection("hlmmasters");
  const values = [data.idsignup, data.branchName, data.userName, data.password, data.emailid, data.referalCode, data.activeStatus];
  const query = "INSERT INTO signup (idsignup, branchName, userName, password, emailid, referalCode, activeStatus) VALUES (?)";
  const [result] = await dbPool.query(query, [values]);
  return result.insertId;
}

async function updateSignup(id, data) {
  const dbPool = getDatabaseConnection("hlmmasters");
  const query = "UPDATE signup SET idsignup=?, branchName=?, userName=?, password=?, emailid=?, referalCode=?, activeStatus=? WHERE id=?";
  const values = [data.idsignup, data.branchName, data.userName, data.password, data.emailid, data.referalCode, data.activeStatus, id];
  await dbPool.query(query, values);
  return true;
}

module.exports = { getAllSignup, getByIdSignup, insertSignup, updateSignup };
