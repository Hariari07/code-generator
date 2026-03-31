const getDatabaseConnection = require("../../../config/db");


async function insertUserProfile(data) {
    try {
      	
	const dbPool = getDatabaseConnection("default");
  	const values = [data.tenderId, data.itemName, data.specification, data.quantity, data.unitId, data.remarks, data.createdAt, data.updatedAt];
  	const query = "INSERT INTO tenderItems (tenderId, itemName, specification, quantity, unitId, remarks, createdAt, updatedAt) VALUES (?)";
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

module.exports = { insertTenderItems };
