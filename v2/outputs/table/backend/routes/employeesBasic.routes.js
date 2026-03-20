const express = require('express');
const router = express.Router();
const EmployeesBasicController = require('../controllers/employeesBasic.controller');

router.get('/', EmployeesBasicController.getAll);
router.post('/getOne', EmployeesBasicController.getOne);

module.exports = router;