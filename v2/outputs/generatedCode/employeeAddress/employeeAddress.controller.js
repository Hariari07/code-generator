const service = require("./employeeAddress.service");

async function getPaginatedemployeeAddress(req, res) {
  try {
    const { page=0, size=10, sortField="", sortOrder=1, filters={} } = req.body;
    const result = await service.getPaginatedemployeeAddress(page, size, sortField, sortOrder, filters);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getAllPlainemployeeAddress(req, res) {
  const data = await service.readAllPlainemployeeAddress();
  res.json({ data });
}

async function getByIdemployeeAddress(req, res) {
  const data = await service.readByIdemployeeAddress(req.body.id);
  res.json({ data });
}

async function createemployeeAddress(req, res) {
  await service.createemployeeAddress(req.body);
  res.status(201).json({ message: "success" });
}

async function updateemployeeAddress(req, res) {
  await service.modifyemployeeAddress(req.body.id, req.body);
  res.json({ message: "success" });
}

async function getRefNoemployeeAddress(req, res) {
  const nextNo = await service.getNextRefNoemployeeAddress();
  res.json({ nextNo });
}

module.exports = {
  getPaginatedemployeeAddress,
  getAllPlainemployeeAddress,
  getByIdemployeeAddress,
  createemployeeAddress,
  updateemployeeAddress,
  getRefNoemployeeAddress
};
