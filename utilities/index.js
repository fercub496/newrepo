const invModel = require("../models/inventory-model")
const Util = {}

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

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

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

    const vehicleData = vehicle[0];

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


module.exports = Util
