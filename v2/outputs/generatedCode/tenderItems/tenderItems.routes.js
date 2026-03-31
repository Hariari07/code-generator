const express = require("express");
const controller = require("./tenderItems.controller");
const router = express.Router();

router.post("/create", controller.createTenderItems);

module.exports = router;
