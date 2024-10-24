const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

validate.inventoryValidationRules = () => { 
    return [
      body('inv_make')
        .isLength({ min: 3 }).withMessage('Make must be at least 3 characters long.')
        .matches(/^[A-Za-z0-9 ]+$/).withMessage('Make must contain only alphanumeric characters.'),
      
      body('inv_model')
        .isLength({ min: 3 }).withMessage('Model must be at least 3 characters long.')
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
        .notEmpty().withMessage('Please choose a classification.'),
  
      body('inv_image')
        .notEmpty().withMessage('Image field cannot be empty.'),
        
      body('inv_thumbnail')
        .notEmpty().withMessage('Thumbnail field cannot be empty.')
    ];
  };

validate.checkEditInventoryRegData = async (req, res, next) => {
    const { 
      inv_make, 
      inv_model, 
      inv_year, 
      inv_description, 
      inv_price, 
      inv_miles, 
      inv_color, 
      classification_id,
      inv_image,
      inv_thumbnail,
      inv_id
    } = req.body;
    
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      const nav = await utilities.getNav();
      let classificationList = await utilities.buildClassificationList();
      res.render("inventory/edit-inventory", {
        errors: errors.array(),
        title: `Edit ${inv_make} ${inv_model}`,
        nav,
        classificationList,
        inventoryItem: {
          inv_make, 
          inv_model, 
          inv_year, 
          inv_description, 
          inv_price, 
          inv_miles, 
          inv_color, 
          classification_id,
          inv_image,
          inv_thumbnail,
          inv_id
        } 
      });
      return;
    }
  
    next();
  };

  module.exports = validate