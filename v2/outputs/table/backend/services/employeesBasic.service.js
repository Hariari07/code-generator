const EmployeesBasicModel = require('../models/employeesBasic.model');

class EmployeesBasicService {
    static async getAll() {
        return await EmployeesBasicModel.getAll();
    }

    static async getById(id) {
        return await EmployeesBasicModel.getById(id);
    }
}
module.exports = EmployeesBasicService;