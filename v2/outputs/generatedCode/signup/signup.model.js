const getDatabaseConnection = require("../../../config/db");

async function insertSignup(data) {
  const dbPool = getDatabaseConnection("hlmmasters");
  const values = [data.idsignup, data.branchName, data.userName, data.password, data.emailid, data.referalCode, data.activeStatus];
  const query = "INSERT INTO signup (idsignup, branchName, userName, password, emailid, referalCode, activeStatus) VALUES (?)";
  const [result] = await dbPool.query(query, [values]);
  return result.insertId;
}

module.exports = { insertSignup };
