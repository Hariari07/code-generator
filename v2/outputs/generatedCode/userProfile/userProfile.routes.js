const express = require("express");
const controller = require("./userProfile.controller");
const multer = require('multer');
// Set up multer for file upload (in memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('file');
const router = express.Router();

router.post("/paginated", controller.getPaginateduserProfile);
router.get(/all", controller.getAllPlainuserProfile);
router.post("/single", controller.getByIduserProfile);
router.post("/create", controller.createuserProfile);
router.post("/update", controller.updateuserProfile);
router.get("/refno", controller.getRefNouserProfile);

module.exports = router;
