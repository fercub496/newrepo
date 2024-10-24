const menuIcon = document.getElementById("menu-icon");
const navMenu = document.querySelector("nav ul");

menuIcon.addEventListener("click", () => {
    navMenu.classList.toggle("show-menu");
  });