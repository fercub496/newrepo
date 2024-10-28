const express = require("express")
const router = express.Router()
const remindersController = require("../controllers/remindersController")
const checkAuthorization = require("../utilities/chekuser")
const utilities = require("../utilities/")

router.get("/", checkAuthorization.userAuthenticated,utilities.handleErrors(remindersController.viewReminders))
router.post("/create", checkAuthorization.userAuthenticated, utilities.handleErrors(remindersController.createReminder))
router.post("/update/:id", checkAuthorization.userAuthenticated, utilities.handleErrors(remindersController.updateReminder))
router.post("/delete/:id", checkAuthorization.userAuthenticated, utilities.handleErrors(remindersController.deleteReminder))

module.exports = router