const model = require("./signup.model");

// -----------------------
async function getPaginatedsignup(page, size, sortField, sortOrder, filters) {
  return model.getAllPaginatedsignup(page, size, sortField, sortOrder, filters);
}

async function readAllPlainsignup() {
  return model.getAllPlainsignup();
}

async function readByIdsignup(id) {
  return model.getByIdsignup(id);
}

async function createsignup(data) {
  return model.insertsignup(data);
}

async function modifysignup(id, data) {
  return model.updatesignup(id, data);
}

async function getNextRefNosignup() {
  return model.getRefNosignup();
}

module.exports = {
  getPaginatedsignup,
  readAllPlainsignup,
  readByIdsignup,
  createsignup,
  modifysignup,
  getNextRefNosignup
};
