const express = require("express");
const controller = require("./tenders.controller");
const router = express.Router();

router.post("/create", controller.createTenders);

module.exports = router;
