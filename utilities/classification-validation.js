const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  * ********************************* */
validate.registationRulesClassification = () => {
    return [
        body("classification_name")
        .notEmpty()
        .isLength({ min: 2 })
        .exists().withMessage("Classification name is required.")
        .withMessage("Classification name must be at least 2 characters long")
        .matches(/^[A-Za-z]+$/)
        .withMessage("New classification name must contain only alphabetic characters and no spaces")
    ]
}

/* ******************************
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "New Classification",
            nav,
            classification_name
        })
        return
    }
    next()
}

module.exports = validate
