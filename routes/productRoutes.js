const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/add', (req, res) => {
  res.render('productAdd');
});

router.post('/add', productController.addProduct);

router.get('/search', productController.searchProducts);
router.get('/', productController.getProductList);
router.get('/:id', productController.getProductDetail);
router.get('/api/products/filter', productController.getFilteredProductsJSON);

module.exports = router;