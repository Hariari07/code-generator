const model = require("./signup.model");

// Generic service for CRUD
async function getAllSignup() { return model.getAllSignup(); }
async function getByIdSignup(id) { return model.getByIdSignup(id); }
async function createSignup(data) { return model.insertSignup(data); }
async function updateSignup(id, data) { return model.updateSignup(id, data); }

module.exports = { getAllSignup, getByIdSignup, createSignup, updateSignup };
