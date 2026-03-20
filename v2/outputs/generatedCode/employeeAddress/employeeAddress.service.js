const model = require("./employeeAddress.model");

// -----------------------
async function getPaginatedemployeeAddress(page, size, sortField, sortOrder, filters) {
  return model.getAllPaginatedemployeeAddress(page, size, sortField, sortOrder, filters);
}

async function readAllPlainemployeeAddress() {
  return model.getAllPlainemployeeAddress();
}

async function readByIdemployeeAddress(id) {
  return model.getByIdemployeeAddress(id);
}

async function createemployeeAddress(data) {
  return model.insertemployeeAddress(data);
}

async function modifyemployeeAddress(id, data) {
  return model.updateemployeeAddress(id, data);
}

async function getNextRefNoemployeeAddress() {
  return model.getRefNoemployeeAddress();
}

module.exports = {
  getPaginatedemployeeAddress,
  readAllPlainemployeeAddress,
  readByIdemployeeAddress,
  createemployeeAddress,
  modifyemployeeAddress,
  getNextRefNoemployeeAddress
};
