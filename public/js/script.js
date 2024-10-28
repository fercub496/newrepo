const menuIcon = document.getElementById("menu-icon")
const navMenu = document.querySelector("nav ul")

menuIcon.addEventListener("click", () => {
    navMenu.classList.toggle("show-menu")
  })

const token = req.cookies?.jwt || null;

function checkJwt(req, res, next) {
  if (!req.cookies || !req.cookies.jwt) {
    return res.status(401).json({ message: 'JWT is required' });
  }
  next();
}