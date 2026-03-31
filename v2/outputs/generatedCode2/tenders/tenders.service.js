const model = require("./tenders.model");

// Generic service for CRUD
async function getAllTenders() { return model.getAllTenders(); }
async function getByIdTenders(id) { return model.getByIdTenders(id); }
async function createTenders(data) { return model.insertTenders(data); }
async function updateTenders(id, data) { return model.updateTenders(id, data); }

module.exports = { getAllTenders, getByIdTenders, createTenders, updateTenders };
