const express = require("express");
const controller = require("./tenderItems.controller");
const router = express.Router();

router.get("/all", controller.getAllTenderItems);
router.post("/single", controller.getByIdTenderItems);
router.post("/create", controller.createTenderItems);
router.post("/update", controller.updateTenderItems);

module.exports = router;
