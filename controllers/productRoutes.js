const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/search', productController.searchProducts);
router.get('/', productController.getProductList);
router.get('/:id', productController.getProductDetail);

module.exports = router;