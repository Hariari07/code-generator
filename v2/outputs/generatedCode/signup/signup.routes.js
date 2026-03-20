const express = require("express");
const controller = require("./signup.controller");
const router = express.Router();

router.post("/signup/paginated", controller.getPaginatedsignup);
router.get("/signup/all", controller.getAllPlainsignup);
router.post("/signup/single", controller.getByIdsignup);
router.post("/signup/create", controller.createsignup);
router.post("/signup/update", controller.updatesignup);
router.get("/signup/refno", controller.getRefNosignup);

module.exports = router;
