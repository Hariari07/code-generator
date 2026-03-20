const service = require("./signup.service");

// Controller handles req.body.data
async function getAllSignup(req, res) {
  try {
    const data = await service.getAllSignup();
    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getByIdSignup(req, res) {
  try {
    const id = req.body.id;
    const data = await service.getByIdSignup(id);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function createSignup(req, res) {
  try {
    const data = req.body.data; // generic
    const id = await service.createSignup(data);
    res.status(201).json({ message: "success", id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function updateSignup(req, res) {
  try {
    const data = req.body.data;
    const id = req.body.id;
    await service.updateSignup(id, data);
    res.json({ message: "success" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { getAllSignup, getByIdSignup, createSignup, updateSignup };
