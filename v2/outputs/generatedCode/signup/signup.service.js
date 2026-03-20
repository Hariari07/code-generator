const model = require("./signup.model");
const bcrypt = require("bcryptjs");

// Prepare finalData and insert
async function createSignup(data) {
  const recData = data.data || data;    

  const finalData = {
    idsignup: recData.idsignup,
    branchName: recData.branchName.value || recData.branchName,
    userName: recData.userName,
    password: recData.password,
    emailid: recData.emailid,
    referalCode: recData.referalCode,
    activeStatus: recData.activeStatus
  };

  return await model.insertSignup(finalData);
}

module.exports = { createSignup };
