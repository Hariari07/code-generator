const model = require("./tenders.model");
const bcrypt = require("bcryptjs");

// Prepare finalData and insert
async function createTenders(data) {
  const recData = data.data || data;    

  const finalData = {
    companyId: recData.companyId,
    subCategoryId: recData.subCategoryId,
    tittle: recData.tittle,
    description: recData.description,
    location: recData.location,
    deadLine: recData.deadLine,
    tenderStatus: recData.tenderStatus,
    createdAt: recData.createdAt,
    updatedAt: recData.updatedAt
  };

  return await model.insertTenders(finalData);
}

module.exports = { createTenders };
