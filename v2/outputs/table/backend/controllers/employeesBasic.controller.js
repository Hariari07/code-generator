const EmployeesBasicService = require('../services/employeesBasic.service');

class EmployeesBasicController {
    static async getAll(req, res) {
        try {
            const data = await EmployeesBasicService.getAll();
            return res.json(data);
        } catch(e){
            return res.status(500).json({error: e.message});
        }
    }

    static async getOne(req, res) {
        try {
            const { id } = req.body;
            if(!id){
                return res.status(400).json({error: "id missing"});
            }
            const data = await EmployeesBasicService.getById(id);
            return res.json(data);
        } catch(e){
            return res.status(500).json({error: e.message});
        }
    }
}
module.exports = EmployeesBasicController;