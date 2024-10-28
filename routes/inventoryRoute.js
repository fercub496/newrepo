const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities =require("../utilities")
const regClassValidate = require('../utilities/classification-validation')
const regValidate = require('../utilities/account-validation')
const regInvValidate = require('../utilities/inventory-validation')
const checkingUser = require('../utilities/chekuser')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

router.get('/detail/:inv_id',utilities.handleErrors(invController.buildByTypeId))


router.get('/',checkingUser.checkAdminorEmployee,utilities.handleErrors(invController.buildManagement))

router.get('/add-classification',checkingUser.checkAdminorEmployee,utilities.handleErrors(invController.buildAddClassification))

// Process the registration data
router.post('/add-classification',checkingUser.checkAdminorEmployee,regClassValidate.registationRulesClassification(),regClassValidate.checkClassificationData,utilities.handleErrors(invController.AddClassification))

router.get('/add-inventory',checkingUser.checkAdminorEmployee,utilities.handleErrors(invController.buildAddInventory))

router.post('/add-inventory',checkingUser.checkAdminorEmployee,regValidate.validationRulesInventory(),regValidate.checkRegInventoryData ,utilities.handleErrors(invController.AddInventory))

router.get("/getInventory/:classification_id",checkingUser.checkAdminorEmployee, utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inventory_id" ,checkingUser.checkAdminorEmployee,utilities.handleErrors(invController.editInventoryView))

router.post("/update/",checkingUser.checkAdminorEmployee,regInvValidate.inventoryValidationRules(),regInvValidate.checkEditInventoryRegData,utilities.handleErrors(invController.updateInventory))

router.get("/delete/:inventory_id",checkingUser.checkAdminorEmployee,utilities.handleErrors(invController.deleteInventoryView))

router.post("/delete/",checkingUser.checkAdminorEmployee,utilities.handleErrors(invController.deleteInventory))

module.exports = router