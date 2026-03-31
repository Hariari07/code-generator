const TendersModel = require('../models/tenders.model');

class TendersService {
    static async getAll() {
        return await TendersModel.getAll();
    }

    static async getById(id) {
        return await TendersModel.getById(id);
    }
}

module.exports = TendersService;