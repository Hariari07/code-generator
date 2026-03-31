const express = require("express");
const controller = require("./tenders.controller");
const router = express.Router();

router.get("/all", controller.getAllTenders);
router.post("/single", controller.getByIdTenders);
router.post("/create", controller.createTenders);
router.post("/update", controller.updateTenders);

module.exports = router;
