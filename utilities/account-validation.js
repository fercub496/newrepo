const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const accountModel = require("../models/account-model")

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), // on error this message is sent.

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 2 })
            .withMessage("Please provide a last name."), // on error this message is sent.

        // valid email is required and cannot already exist in the database
body("account_email")
.trim()
.isEmail()
.normalizeEmail() // refer to validator.js docs
.withMessage("A valid email is required.")
.custom(async (account_email) => {
  const emailExists = await accountModel.checkExistingEmail(account_email)
  if (emailExists){
    throw new Error("Email exists. Please log in or use different email")
  }
}),

        // password is required and must be strong password
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements."),
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
            errors,
            title: "Registration",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

validate.validationRulesInventory = () => { 
    return [
      body('inv_make')
        .isLength({ min: 3 }).withMessage('Brand must have at least 3 characters.')
        .matches(/^[A-Za-z0-9 ]+$/).withMessage('Brand must contain only alphanumeric characters.'),
      
      body('inv_model')
        .isLength({ min: 3 }).withMessage('Model must have at least 3 characters.')
        .matches(/^[A-Za-z0-9 ]+$/).withMessage('Model must contain only alphanumeric characters.'),
  
      body('inv_year')
        .isInt({ min: 1900, max: 2100 }).withMessage('Year must be a valid 4-digit year.'),
  
      body('inv_description')
        .notEmpty().withMessage('Description is required.'),
  
      body('inv_price')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number.'),
  
      body('inv_miles')
        .isInt({ min: 0 }).withMessage('Miles must be a positive number.'),
  
      body('inv_color')
        .notEmpty().withMessage('Color is required.'),
  
      body('classification_id')
        .notEmpty().withMessage('Please choose a classification from list.'),
  
      body('inv_image')
        .notEmpty().withMessage('Image cannot be empty.'),
        
      body('inv_thumbnail')
        .notEmpty().withMessage('Thumbnail cannot be empty.')
    ];
  };

  validate.checkRegInventoryData = async (req, res, next) => {
    const { 
      inv_make, 
      inv_model, 
      inv_year, 
      inv_description, 
      inv_price, 
      inv_miles, 
      inv_color, 
      inv_image,
      inv_thumbnail 
    } = req.body;
    
    let errors = []
    errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      let classificationList = await utilities.buildClassificationList();
  
      res.render("inventory/add-inventory", {
        errors,
        title: "Add Inventory",
        nav,
        classificationList,
        inv_make, 
        inv_model, 
        inv_year, 
        inv_description, 
        inv_price, 
        inv_miles, 
        inv_color, 
        inv_image,
        inv_thumbnail
      });
      return;
    }
  
    next();
  };
  
  validate.loginRules = () => {
    return [
      body("account_email")
        .trim()
        .isEmail()
        .withMessage("A valid email is required."),
  
        body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ];
}

  validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/login", {
        errors,
        title: "Login",
        nav,
        account_email,
      })
      return
    }
    next()
}
 


validate.updateAccountRules = () => {
  return [
    body("firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a first name.")
      .isLength({ min: 1 })
      .withMessage("First name must be at least 1 character long."),

    body("lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a last name.")
      .isLength({ min: 2 })
      .withMessage("Last name must be at least 2 characters long."),

    body("email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required.")
      .normalizeEmail()
  ];
};

validate.checkAccountUpdateData = async (req, res, next) => {
  const { firstname, lastname, email, account_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const account_firstname = firstname;
    const account_lastname = lastname;
    const account_email = email;
    res.render('account/account-update', {
      errors,
      title: "Update Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
    return
  }
  next()
};

validate.updatePasswordRules = () => {
  return [
      body("password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

validate.checkPasswordUpdateData = async (req, res, next) => {
  const { firstname, lastname, email, account_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const account_firstname = firstname;
    const account_lastname = lastname;
    const account_email = email;
    res.render('account/account-update', {
      errors,
      title: "Update Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id
    })
    return
  }
  next()
};

  
module.exports = validate
