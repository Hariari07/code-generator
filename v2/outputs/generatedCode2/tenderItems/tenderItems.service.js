const model = require("./tenderItems.model");

// Generic service for CRUD
async function getAllTenderItems() { return model.getAllTenderItems(); }
async function getByIdTenderItems(id) { return model.getByIdTenderItems(id); }
async function createTenderItems(data) { return model.insertTenderItems(data); }
async function updateTenderItems(id, data) { return model.updateTenderItems(id, data); }

module.exports = { getAllTenderItems, getByIdTenderItems, createTenderItems, updateTenderItems };
