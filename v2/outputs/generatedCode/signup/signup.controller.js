const service = require("./signup.service");

async function getPaginatedsignup(req, res) {
  try {
    const { page=0, size=10, sortField="", sortOrder=1, filters={} } = req.body;
    const result = await service.getPaginatedsignup(page, size, sortField, sortOrder, filters);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getAllPlainsignup(req, res) {
  const data = await service.readAllPlainsignup();
  res.json({ data });
}

async function getByIdsignup(req, res) {
  const data = await service.readByIdsignup(req.body.id);
  res.json({ data });
}

async function createsignup(req, res) {
  await service.createsignup(req.body);
  res.status(201).json({ message: "success" });
}

async function updatesignup(req, res) {
  await service.modifysignup(req.body.id, req.body);
  res.json({ message: "success" });
}

async function getRefNosignup(req, res) {
  const nextNo = await service.getNextRefNosignup();
  res.json({ nextNo });
}

module.exports = {
  getPaginatedsignup,
  getAllPlainsignup,
  getByIdsignup,
  createsignup,
  updatesignup,
  getRefNosignup
};
