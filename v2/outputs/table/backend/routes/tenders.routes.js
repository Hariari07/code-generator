const express = require('express');
const router = express.Router();
const TendersController = require('../controllers/tenders.controller');

router.get('/', TendersController.getAll);
router.post('/getOne', TendersController.getOne);

module.exports = router;