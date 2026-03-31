const getDatabaseConnection = require("../../../config/db");


async function insertUserProfile(data) {
    try {
      	
	const dbPool = getDatabaseConnection("default");
  	const values = [data.companyId, data.subCategoryId, data.tittle, data.description, data.location, data.deadLine, data.tenderStatus, data.createdAt, data.updatedAt];
  	const query = "INSERT INTO tenders (companyId, subCategoryId, tittle, description, location, deadLine, tenderStatus, createdAt, updatedAt) VALUES (?)";
  	const [result] = await dbPool.query(query, [values]);


        return {
            success: true,
            insertId: result.insertId,
            message: "User profile inserted successfully"
        };

    } catch (error) {
        console.error("Insert Error:", error);

        return {
            success: false,
            insertId: null,
            message: "Failed to insert user profile",
            error: error.message
        };
    }
}

module.exports = { insertTenders };
