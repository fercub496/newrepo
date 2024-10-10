const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)


/*Testing*/
/* **************************************
* Vehicle detail route
* ************************************ */
router.get('/inv/detail/:inv_id', invController.buildByTypeId)


/*Testing*/

module.exports = router