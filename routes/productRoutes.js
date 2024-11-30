const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login');
}

router.get('/search', isAuthenticated, productController.searchProducts);
router.get('/', isAuthenticated, productController.getProductList);
router.get('/:id', isAuthenticated, productController.getProductDetail);

module.exports = router;