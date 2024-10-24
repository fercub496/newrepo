const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities =require("../utilities")
const regClassValidate = require('../utilities/classification-validation')
const regValidate = require('../utilities/account-validation');
const regInvValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

router.get('/detail/:inv_id',utilities.handleErrors(invController.buildByTypeId))


router.get('/',utilities.handleErrors(invController.buildManagement))

router.get('/add-classification',utilities.handleErrors(invController.buildAddClassification))

// Process the registration data
router.post('/add-classification',regClassValidate.registationRulesClassification(),regClassValidate.checkClassificationData,utilities.handleErrors(invController.AddClassification))

router.get('/add-inventory',utilities.handleErrors(invController.buildAddInventory))

router.post('/add-inventory',regValidate.validationRulesInventory(),regValidate.checkRegInventoryData ,utilities.handleErrors(invController.AddInventory))

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inventory_id",utilities.handleErrors(invController.editInventoryView))

router.post("/update/",regInvValidate.inventoryValidationRules(),regInvValidate.checkEditInventoryRegData,utilities.handleErrors(invController.updateInventory))

module.exports = router