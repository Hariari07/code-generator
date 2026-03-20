const express = require("express");
const controller = require("./employeeAddress.controller");
const router = express.Router();

router.get("/getAllLimit", controller.getAll);
router.get("/getAll", controller.getAllPlain);
router.post("/getSingle", controller.getById);
router.post("/create", controller.insert);
router.post("/update", controller.update);
router.get("/getNextRefNo", controller.getRefNo);

module.exports = router;
