const jwt = require('jsonwebtoken')

const checkAdminorEmployee = (req, res, next) => {
  const token = req.cookies.jwt

  if (!token) {
    req.flash('notice', 'You must be logged in to access this page.')
    return res.redirect('/account/login')
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    if (decoded.account_type !== 'Employee' && decoded.account_type !== 'Admin') {
      req.flash('notice', 'You must be logged in as an Employee or Admin to access this page.')
      return res.redirect('/account/login')
    }

    req.user = decoded

    next();
  } catch (error) {
    console.error('Error verifying token:', error)
    req.flash('notice', 'Invalid or expired token. Please log in again.')
    return res.redirect('/account/login')
  }
}

const userAuthenticated = (req,res,next) =>{
    const token = req.cookies.jwt || null
    if (token) {
      try {
        req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        next();
      } catch (err) {
        console.error("Token verification failed:", err);
        res.redirect('/account/login');
      }
    } else {
      req.flash("error", "Please log in to access this page.")
      res.redirect("/account/login")
    }
  }


module.exports = { checkAdminorEmployee, userAuthenticated }