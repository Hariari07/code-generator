const service = require("./tenders.service");

async function createTenders(req, res) {
  try {
    const data = req.body.data;
    const result = await service.createTenders({ data });
    res.status(201).json({ message: "success", id: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { createTenders };
