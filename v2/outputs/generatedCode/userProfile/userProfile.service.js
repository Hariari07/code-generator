const model = require("./userProfile.model");

// -----------------------
async function getPaginateduserProfile(page, size, sortField, sortOrder, filters) {
  return model.getAllPaginateduserProfile(page, size, sortField, sortOrder, filters);
}

async function readAllPlainuserProfile() {
  return model.getAllPlainuserProfile();
}

async function readByIduserProfile(id) {
  return model.getByIduserProfile(id);
}

// Example of calling this function for checking name existence on update (excluding the current partyId)
async function checkExistsDatauserProfile(id) {
  return await model.checkEmployeeCodeExists(id); // Returns true/false
}

async function createuserProfile(data) {
  return model.insertuserProfile(data);
}

async function modifyuserProfile(id, data) {
  return model.updateuserProfile(id, data);
}

async function getNextRefNouserProfile() {
  return model.getRefNouserProfile();
}

module.exports = {
  getPaginateduserProfile,
  readAllPlainuserProfile,
  readByIduserProfile,
  createuserProfile,
  modifyuserProfile,
  getNextRefNouserProfile
};
