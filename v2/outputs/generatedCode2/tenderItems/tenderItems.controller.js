const service = require("./tenderItems.service");

// Controller handles req.body.data
async function getAllTenderItems(req, res) {
  try {
    const data = await service.getAllTenderItems();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getByIdTenderItems(req, res) {
  try {
    const id = req.body.id;
    const data = await service.getByIdTenderItems(id);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function createTenderItems(req, res) {
  try {
    const data = req.body.data; // generic
    const id = await service.createTenderItems(data);
    res.status(201).json({ message: "success", id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateTenderItems(req, res) {
  try {
    const data = req.body.data;
    const id = req.body.id;
    await service.updateTenderItems(id, data);
    res.json({ message: "success" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getAllTenderItems, getByIdTenderItems, createTenderItems, updateTenderItems };
