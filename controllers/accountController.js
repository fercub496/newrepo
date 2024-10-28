
const accountModel = require("../models/account-model")
const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Registration",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
        })
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
      return
    }
    try {
      if (await bcrypt.compare(account_password, accountData.account_password)) {
        delete accountData.account_password
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
        if(process.env.NODE_ENV === 'development') {
          res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        } else {
          res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        }
        return res.redirect("/account/")
      }
      else {
        req.flash("message notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
          title: "Login",
          nav,
          errors: null,
          account_email,
        })
      }
    } catch (error) {
      console.error("Login error:", error)
    req.flash("notice", "An error occurred during login.")
    res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    }
  }

async function buildLoginLogged(req, res, next) {
    try {
        let nav = await utilities.getNav()
        
        const token = req.cookies?.jwt

        if (!token) {
          req.flash('notice', 'You must be logged in to access the session view.')
          return res.redirect('/account/login')
        }
    
        const permited = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        res.render("account/logged", {
          title: "Session View",
          nav,
          account_firstname: permited.account_firstname,
          account_type: permited.account_type,
          errors: null
        })
      } catch (error) {
        console.error("Error building session:", error)
        req.flash('error', 'An error occurred while loading the session view.')
        return res.redirect('/account/login')
      }
    }

async function logoutAccount(req, res) {
      try {
        res.clearCookie('jwt', { httpOnly: true, secure: process.env.NODE_ENV !== 'development' })
    
        req.session.destroy((err) => {
          if (err) {
            console.error('Error destroying session:', err)
            return res.redirect('/')
          }
          res.clearCookie('connect.sid')
          res.redirect('/')
        })
      } catch (error) {
        console.error('Unexpected error during logout:', error)
        res.redirect('/')
      }
    }

async function getUpdateView(req, res) {
      try {
          const accountId = req.params.id
          const account = await accountModel.getAccountById(accountId)
    
          if (!account) {
              req.flash("notice", "Account not found.")
              return res.redirect("/account")
          }
    
          let nav = await utilities.getNav()
          const { account_id, account_firstname, account_lastname, account_email } = account
    
          res.render("account/account-update", {
              title: "Account Update",
              nav,
              account_id,
              account_firstname,
              account_lastname,
              account_email,
              errors: null
          });
      } catch (error) {
          console.error("Error rendering update account view:", error)
          req.flash("error", "An error occurred while loading the update account page.")
          res.redirect("/account")
      }
    }

async function updateAccount (req, res) {
      try {
          const account = {
            account_firstname: req.body.firstname,
            account_lastname: req.body.lastname,
            account_email: req.body.email,
            account_id: req.body.account_id
        }
        
        const updateResult = await accountModel.updateAccount(account)
        if (updateResult) {
          req.flash('notice', 'Account updated successfully.')
          res.redirect('/account')
        } else {
          req.flash('error', 'Failed to update account.')
          res.redirect('/account/update')
        }
      } catch (error) {
        req.flash('error', 'Error updating account.')
        res.redirect('/account/update')
      }
    }
    
async function changePassword (req, res) {
      try {
        const passwordChangeResult = await accountModel.updatePassword(req.body.account_id, req.body.password)
        if (passwordChangeResult) {
          req.flash('notice', 'Password updated successfully.')
          res.redirect('/account');
        } else {
          req.flash('error', 'Failed to update password.')
          res.redirect('/account/update')
        }
      } catch (error) {
        req.flash('error', 'Error updating password.')
        res.redirect('/account/update')
      }
    }
    
   
module.exports = { buildLogin, buildRegister, registerAccount , accountLogin, buildLoginLogged , logoutAccount,getUpdateView,updateAccount,changePassword}