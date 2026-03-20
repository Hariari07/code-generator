const service = require("./employeeAddress.service");

// Get all with filter
async function getAll(req, res) {
  try { const data = await service.readAll(req.body.filter, req.body.limit, req.body.offset); res.json({ data }); } 
  catch (error) { res.status(500).json({ message: error.message }); }
}

// Get all plain
async function getAllPlain(req, res) {
  try { const data = await service.readAllPlain(); res.json({ data }); } 
  catch (error) { res.status(500).json({ message: error.message }); }
}

// Get single by ID
async function getById(req, res) {
  try { const data = await service.readById(req.body.id); res.json({ data }); } 
  catch (error) { res.status(500).json({ message: error.message }); }
}

// Insert
async function insert(req, res) {
  try { const id = await service.create(req.body); res.json({ id }); } 
  catch (error) { res.status(500).json({ message: error.message }); }
}

// Update
async function update(req, res) {
  try { const affected = await service.modify(req.body); res.json({ updated: affected }); } 
  catch (error) { res.status(500).json({ message: error.message }); }
}

// Get next RefNo
async function getRefNo(req, res) {
  try { const nextNo = await service.getNextRefNo(); res.json({ nextNo }); } 
  catch (error) { res.status(500).json({ message: error.message }); }
}

module.exports = { getAll, getAllPlain, getById, insert, update, getRefNo };
