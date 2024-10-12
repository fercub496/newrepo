const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation')



// Route to build inventory by classification view
router.get("/login", accountController.buildLogin)

router.get("/register", accountController.buildRegister)

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

module.exports = router