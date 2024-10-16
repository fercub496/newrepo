const express = require('express');
const router = express.Router();
const errorController = require('../controllers/errorController');

router.use((req, res) => {
  errorController.get404(req, res); 
});

router.use((err, req, res, next) => {
  errorController.get500(err, req, res, next); 
});

module.exports = router;