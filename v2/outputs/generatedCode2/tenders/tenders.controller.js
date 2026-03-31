const service = require("./tenders.service");

// Controller handles req.body.data
async function getAllTenders(req, res) {
  try {
    const data = await service.getAllTenders();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getByIdTenders(req, res) {
  try {
    const id = req.body.id;
    const data = await service.getByIdTenders(id);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function createTenders(req, res) {
  try {
    const data = req.body.data; // generic
    const id = await service.createTenders(data);
    res.status(201).json({ message: "success", id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateTenders(req, res) {
  try {
    const data = req.body.data;
    const id = req.body.id;
    await service.updateTenders(id, data);
    res.json({ message: "success" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getAllTenders, getByIdTenders, createTenders, updateTenders };
