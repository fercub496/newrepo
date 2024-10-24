const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
        list += "</li>"
    })
    list += "</ul>"
    return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid
    if (data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id
                + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + 'details"><img src="' + vehicle.inv_thumbnail
                + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
                + ' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
                + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
                + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
                + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

Util.buildVehicleDetail = async function (vehiclePromise) {
    const vehicle = await vehiclePromise;
    console.log(vehicle);
    if (!vehicle || vehicle.length === 0) {
        return '<p>No vehicle details found.</p>';
    }

    const vehicleData = vehicle;

    let detail = '<section id="vehicle-detail" class="vehicle-detail">';
    detail += '<h2 class="vehicle-vname"> ' + vehicleData.inv_year + ' ' + vehicleData.inv_make + ' ' + vehicleData.inv_model + '</h2>';

    detail += '<div class="vehicle-image">';
    detail += '<img src="' + vehicleData.inv_image + '" alt="Image of '
        + vehicleData.inv_make + ' ' + vehicleData.inv_model + ' on CSE Motors" />';
    detail += '</div>';

    detail += '<div class="vehicle-info">';
    detail += '<p class="price"><strong>Price:</strong> ' + new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(vehicleData.inv_price) + '</p>';

    detail += '<div class="vehicle-specs">';
    detail += '<p><strong>Mileage:</strong> ' + new Intl.NumberFormat('en-US').format(vehicleData.inv_miles) + ' miles</p>';
    detail += '<p><strong>Color:</strong> ' + vehicleData.inv_color + '</p>';
    detail += '<p><strong>Description:</strong> ' + vehicleData.inv_description + '</p>';
    detail += '<p><strong>Classification:</strong> ' + vehicleData.classification_name + '</p>';
    detail += '</div>'; 
    
    detail += '</div>'; 
    detail += '</section>';

    return detail;
}

Util.BuildManagementSite = async function (req, res, next) {
    let management = "<ul>"
    management += '<li><a href="/inv/add-classification" title="Add New Classification">Add New Classification</a></li>'
    management += '<li><a href="/inv/add-inventory" title="Add New Inventory">Add New Inventory</a></li>'
    management += "</ul>"
    return management
}

Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  }

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
     jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
       if (err) {
        req.flash("Please log in")
        res.clearCookie("jwt")
        return res.redirect("/account/login")
       }
       res.locals.accountData = accountData
       res.locals.loggedin = 1
       next()
      })
    } else {
     next()
    }
   } 

Util.checkLogin = (req, res, next) => {
    if (res.locals.loggedin) {
      next()
    } else {
      req.flash("notice", "Please log in.")
      return res.redirect("/account/login")
    }
   }
  
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util
