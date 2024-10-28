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
                title: `${vehicle.inv_make} ${vehicle.inv_model}`, // Title displays make and model
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

invCont.buildManagement = async function (req, res, next) {
        let management = await utilities.BuildManagementSite()
        let nav = await utilities.getNav()
        const classificationSelect = await utilities.buildClassificationList()
            res.render("./inventory/management", {
                nav,
                title: "Vehicle Management",
                management,
                classificationSelect,
                errors: null})
}

invCont.buildAddClassification= utilities.handleErrors( async function (req, res, next) {
   try{ let nav = await utilities.getNav()
    const notice = req.flash("notice");
    res.render("inventory/add-classification", {
        notice,
        title: "Add Classification",
        nav,
        errors: null 
    })}
    catch (error){console.error("Error rendering add classification view", error)}
})

/* ****************************************
*  Process Add Classification
* *************************************** */
invCont.AddClassification = utilities.handleErrors(async function (req, res, next) {
   try
   {
    const { classification_name } = req.body

    await invModel.AddNewClassification(classification_name)

    req.flash("notice", "New classification added successfully.");
    res.redirect("/inv");
  } catch (error) {
    req.flash("notice", "Classification is not added.Failure.");
    res.redirect("/inv/add-classification");
  }
})

invCont.buildAddInventory= utilities.handleErrors( async function (req, res, next) {
    try{ const nav = await utilities.getNav()
        const classificationList = await utilities.buildClassificationList()
     const notice = req.flash("notice")

     const { 
        inv_make = '', 
        inv_model = '', 
        inv_year = '', 
        inv_color = '', 
        inv_description = '', 
        inv_price = '', 
        inv_miles = '', 
        inv_image = '/images/vehicles/no-image.png', 
        inv_thumbnail = '/images/vehicles/no-image-tn.png',
        classification_id = '' 
      } = req.body

     res.render("inventory/add-inventory", {
        classificationList,
         notice,
         title: "Add Inventory",
         nav,
         inv_make, 
         inv_model, 
         inv_year, 
         inv_color,
         inv_description,
         inv_price,
         inv_miles,
         inv_image, 
         inv_thumbnail,
         classification_id,
         errors: null 
     })}
     catch (error){console.error("Error rendering add inventory view", error)
        res.redirect("/inv");
     }
 })
 

invCont.AddInventory = utilities.handleErrors(async function (req, res, next) {
    try
    {
     const { inv_make,inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles, inv_color,classification_id } = req.body
 
     await invModel.AddNewInventory(inv_make,inv_model,inv_year,inv_description,inv_image,inv_thumbnail,inv_price,inv_miles, inv_color,classification_id)
 
     req.flash("notice", "New inventory added successfully.");
     res.redirect("/inv");
   } catch (error) {
     req.flash("notice", "Inventory is not added.Failure.");
     res.redirect("/inv/add-inventory");
   }
 })

 /* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }
  }

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
    const inv_id = req.params.inventory_id
    let nav = await utilities.getNav()
    const itemData = await invModel.getVehiclesbyId(inv_id)
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    console.log(itemData)
    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
    })
  }

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body
    const updateResult = await invModel.updateInventory(
      inv_id,  
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    )
  
    if (updateResult) {
      const itemName = updateResult.inv_make + " " + updateResult.inv_model
      req.flash("notice", `The ${itemName} was successfully updated.`)
      res.redirect("/inv/")
    } else {
      const classificationSelect = await utilities.buildClassificationList(classification_id)
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the insert failed.")
      res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
      })
    }
  }

  invCont.deleteInventoryView = async function (req, res, next) {
    const inv_id = req.params.inventory_id
    let nav = await utilities.getNav()
    const itemData = await invModel.getVehiclesbyId(inv_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    console.log(itemData)
    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
    })
  }

  invCont.deleteInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    } = req.body
    const deleteResult = await invModel.deleteInventory(inv_id)
  
    if (deleteResult) {
      req.flash("notice", `The item was successfully deleted.`)
      res.redirect("/inv/")
    } else {
      const itemName = `${inv_make} ${inv_model}`
      req.flash("notice", "Sorry, the deletion failed.")
      res.status(501).render("inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
      })
    }
  }
  

module.exports = invCont;
