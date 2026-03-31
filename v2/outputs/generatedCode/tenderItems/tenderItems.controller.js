const service = require("./tenderItems.service");

async function createTenderItems(req, res) {
  try {
    const data = req.body.data;
    const result = await service.createTenderItems({ data });
    res.status(201).json({ message: "success", id: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { createTenderItems };
