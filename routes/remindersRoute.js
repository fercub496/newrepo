const express = require("express")
const router = express.Router()
const remindersController = require("../controllers/remindersController")
const checkAuthorization = require("../utilities/chekuser")
const utilities = require("../utilities/")

router.get("/", checkAuthorization.userAuthenticated,utilities.handleErrors(remindersController.viewReminders))
router.post("/create", checkAuthorization.userAuthenticated, utilities.handleErrors(remindersController.createReminder))

module.exports = router