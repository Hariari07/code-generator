const service = require("./signup.service");

async function createSignup(req, res) {
  try {
    const data = req.body.data;
    const result = await service.createSignup({ data });
    res.status(201).json({ message: "success", id: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = { createSignup };
