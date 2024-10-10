const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationsbyid error " + error)
    }
}

/*Testing*/

async function getVehicles() {
    return await pool.query("SELECT * FROM public.inventory ORDER BY inv_id")
}

async function getVehiclesbyId(inv_id) {
    try {
        const data = await pool.query(
            `SELECT i.inv_id, i.inv_make, i.inv_model, i.inv_year, i.inv_description, 
                    i.inv_image, i.inv_thumbnail, i.inv_price, i.inv_miles, 
                    i.inv_color, c.classification_name 
            FROM public.inventory AS i 
            JOIN public.classification AS c 
            ON i.classification_id = c.classification_id 
            WHERE i.inv_id = $1`,
            [inv_id]
        )
        return data.rows[0]
    } catch (error) {
        console.error("getVehiclesbyid error " + error)
    }
}

/*----Testing*/

module.exports = {
    getClassifications,
    getInventoryByClassificationId,
    getVehicles,
    getVehiclesbyId
}






/*Testing---- module.exports = { getClassifications, getInventoryByClassificationId } module.exports = { getVehicles, getVehiclesbyId }*/



/*------Testing*/

/*
async function getVehicleById(inv_id) {
    try {
        const sql = 'SELECT * FROM public.inventory WHERE inv_id = $1';
        const data = await pool.query(sql, [inv_id]);
        return data.rows[0]; // Return the first matching vehicle (or undefined if none found)
    } catch (error) {
        console.error("Error querying vehicle by ID:", error);
        throw error;
    }
}*/