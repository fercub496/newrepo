const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation')



// Route to build inventory by classification view
router.get("/login",utilities.handleErrors(accountController.buildLogin))

router.get("/register", utilities.handleErrors(accountController.buildRegister))

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!")
})

//router.post('/register', utilities.handleErrors(accountController.registerAccount))

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildLoginLogged))

router.get('/logout', utilities.handleErrors(accountController.logoutAccount))
router.get('/update/:id', utilities.handleErrors(accountController.getUpdateView))
router.post('/update', regValidate.updateAccountRules(), regValidate.checkAccountUpdateData, utilities.handleErrors(accountController.updateAccount))
router.post('/change-password', regValidate.updatePasswordRules(), regValidate.checkPasswordUpdateData, utilities.handleErrors(accountController.changePassword))

module.exports = router