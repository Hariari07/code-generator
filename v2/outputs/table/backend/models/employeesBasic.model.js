const pool = require('../db');

class EmployeesBasicModel {
    static async getAll() {
        const [rows] = await pool.query('SELECT [object Object], [object Object], [object Object], [object Object], [object Object], [object Object], [object Object], [object Object], [object Object], [object Object] FROM employeesBasic');
        return rows;
    }

    static async getById(id) {
        const [rows] = await pool.query(
            'SELECT [object Object], [object Object], [object Object], [object Object], [object Object], [object Object], [object Object], [object Object], [object Object], [object Object] FROM employeesBasic WHERE id = ?',
            [id]
        );
        return rows[0];
    }
}
module.exports = EmployeesBasicModel;