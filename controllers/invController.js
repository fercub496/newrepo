const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

invCont.buildByTypeId = async function (req, res, next) {
    try {
        const inv_id = req.params.inv_id;
        const vehicle = await invModel.getVehiclesbyId(inv_id); // Fetch vehicle by ID

        if (vehicle) {
            const detail = await utilities.buildVehicleDetail(vehicle); // Format vehicle details for view
            let nav = await utilities.getNav();
            res.render("./inventory/vehicle-detail", {
                title: `${vehicle[0].inv_make} ${vehicle[0].inv_model}`, // Title displays make and model
                nav,
                detail,
            });
        } else {
            res.status(404).send("Sorry, the vehicle could not be found.");
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
};



module.exports = invCont;
