const model = require("./employees.model");

// Read all with filter
async function readAll(filter, limit, offset) {
  try { return await model.getAll(filter, limit, offset); } 
  catch (error) { console.log("Error fetching all employees: " + error.message); throw error; }
}

// Read plain all
async function readAllPlain() {
  try { return await model.getAllPlain(); }
  catch (error) { console.log("Error fetching all plain employees: " + error.message); throw error; }
}

// Read single by ID
async function readById(id) {
  try { return await model.getById(id); } 
  catch (error) { console.log("Error fetching employees by ID: " + error.message); throw error; }
}

// Create new record(s)
async function create(data) {
  try { return await model.insert(data); } 
  catch (error) { console.log("Error inserting into employees: " + error.message); throw error; }
}

// Update existing record(s)
async function modify(data) {
  try { return await model.update(data); } 
  catch (error) { console.log("Error updating employees: " + error.message); throw error; }
}

// Get next RefNo
async function getNextRefNo() {
  try { return await model.getRefNo(); }
  catch (error) { console.log("Error getting next RefNo for employees: " + error.message); throw error; }
}

module.exports = { readAll, readAllPlain, readById, create, modify, getNextRefNo };
