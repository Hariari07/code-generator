const model = require("./tenderItems.model");
const bcrypt = require("bcryptjs");

// Prepare finalData and insert
async function createTenderItems(data) {
  const recData = data.data || data;    

  const finalData = {
    tenderId: recData.tenderId,
    itemName: recData.itemName,
    specification: recData.specification,
    quantity: recData.quantity,
    unitId: recData.unitId,
    remarks: recData.remarks,
    createdAt: recData.createdAt,
    updatedAt: recData.updatedAt
  };

  return await model.insertTenderItems(finalData);
}

module.exports = { createTenderItems };
