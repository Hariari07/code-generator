const pool = require('../db');

class TendersModel {
    static async getAll() {
        const [rows] = await pool.query('SELECT id, companyId, subCategoryId, tittle, description, location, deadLine, tenderStatus, createdAt, updatedAt FROM tenders');
        return rows;
    }

    static async getById(id) {
        const [rows] = await pool.query(
            'SELECT id, companyId, subCategoryId, tittle, description, location, deadLine, tenderStatus, createdAt, updatedAt FROM tenders WHERE id = ?',
            [id]
        );
        return rows[0];
    }
}

module.exports = TendersModel;