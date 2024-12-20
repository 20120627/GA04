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

// Cart routes
router.get('/cart', isAuthenticated, (req, res) => {
  const cart = req.session.cart || [];
  const totalPrice = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  res.render('cart', { cart, totalPrice });
});

router.post('/cart/add/:id', isAuthenticated, async (req, res) => {
  const productId = req.params.id;
  const quantity = parseInt(req.body.quantity) || 1;

  const product = await Product.findByPk(productId);
  if (!product) {
    return res.status(404).send('Product not found');
  }

  if (!req.session.cart) {
    req.session.cart = [];
  }

  const cartItem = req.session.cart.find(item => item.product.id === productId);
  if (cartItem) {
    cartItem.quantity += quantity;
  } else {
    req.session.cart.push({ product, quantity });
  }

  res.redirect('/cart');
});

router.post('/cart/update/:id', isAuthenticated, (req, res) => {
  const productId = req.params.id;
  const quantity = parseInt(req.body.quantity);

  const cart = req.session.cart || [];
  const cartItem = cart.find(item => item.product.id === productId);

  if (cartItem) {
    cartItem.quantity = quantity;
  }

  res.redirect('/cart');
});

router.post('/cart/remove/:id', isAuthenticated, (req, res) => {
  const productId = req.params.id;

  req.session.cart = (req.session.cart || []).filter(item => item.product.id !== productId);

  res.redirect('/cart');
});

router.post('/checkout', isAuthenticated, async (req, res) => {
  const cart = req.session.cart || [];

  // Create order and move items from cart to order
  const order = await Order.create({ userId: req.user.id });
  for (const item of cart) {
    await OrderItem.create({
      orderId: order.id,
      productId: item.product.id,
      quantity: item.quantity,
      price: item.product.price
    });
  }

  req.session.cart = [];

  res.redirect('/orders');
});

router.get('/api/products', productController.getProductListJSON);

router.get('/api/products/filter', productController.getFilteredProductsJSON);

router.get('/products', productController.getProductList);

module.exports = router;