const express = require("express");
const controller = require("./signup.controller");
const router = express.Router();

router.get("/all", controller.getAllSignup);
router.post("/single", controller.getByIdSignup);
router.post("/create", controller.createSignup);
router.post("/update", controller.updateSignup);

module.exports = router;
