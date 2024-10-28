/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************
*********************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const baseController = require("./controllers/baseController")
const session = require("express-session")
const pool = require('./database/')
const accountRoute = require("./routes/accountRoute")
const errorRoutes = require('./routes/errorRoute')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const checkToken = require('./utilities/tokenauth')
/* ***********************
 * Adding the utilities file
 *************************/

const utilities = require('./utilities');

app.use((req, res, next) => {
  req.jwt = req.cookies?.jwt || null;
  next();
});


app.use(cookieParser())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(checkToken)
app.use(utilities.checkJWTToken)

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res)
  next()
})



/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
*/
app.use(static)
// Inventory routes
app.use("/inv", inventoryRoute)

//account Route
app.use("/account", accountRoute)

//Index route

app.get("/", utilities.handleErrors(baseController.buildHome)
)
app.get('/favicon.ico', (req, res) => res.status(204).end())



app.get('/error500', (req, res, next) => {
  const error = new Error('This is a simulated server error!');
  error.status = 500;
  next(error); 
});

app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' })
})


app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

  let message = 'Oh no! There was a crash. Maybe try a different route?';
  if (err.status === 404) {
    message = err.message;
  }

  if (err.status === 500) {
    res.status(500).render("errors/500", {
      title: '500 - Server Error',
      message,
      nav
    });
  } else {
    res.status(err.status || 500).render("errors/error", {
      title: err.status || 'Server Error',
      message,
      nav
    });
  }
});

/*ERROR 500 */

app.use(errorRoutes);

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
