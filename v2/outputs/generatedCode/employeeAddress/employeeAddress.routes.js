const express = require("express");
const controller = require("./employeeAddress.controller");
const router = express.Router();

router.post("/employeeAddress/paginated", controller.getPaginatedemployeeAddress);
router.get("/employeeAddress/all", controller.getAllPlainemployeeAddress);
router.post("/employeeAddress/single", controller.getByIdemployeeAddress);
router.post("/employeeAddress/create", controller.createemployeeAddress);
router.post("/employeeAddress/update", controller.updateemployeeAddress);
router.get("/employeeAddress/refno", controller.getRefNoemployeeAddress);

module.exports = router;
