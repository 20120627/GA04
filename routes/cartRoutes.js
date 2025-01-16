const express = require('express');
const router = express.Router();
const { Product } = require('../models'); // Adjust the path as necessary
const cartController = require('../controllers/cartController'); // Adjust the path as necessary

// Cart routes
router.get('/', (req, res) => {
  const cart = req.session.cart || [];
  const totalPrice = cart.reduce((total, item) => total + parseFloat(item.product.price) * item.quantity, 0);
  res.render('cart', { cart, totalPrice });
});

router.post('/add/:id', async (req, res) => {
  const productId = parseInt(req.params.id);
  const quantity = parseInt(req.body.quantity) || 1;

  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).send('Product not found');
    }

    if (!req.session.cart) {
      req.session.cart = [];
    }

    const cartItem = req.session.cart.find(item => parseInt(item.product.id) === productId);
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      req.session.cart.push({ product, quantity });
    }

    res.redirect('/cart');
  } catch (error) {
    console.error('Error adding product to cart:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/update/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const quantity = parseInt(req.body.quantity);

  console.log(`Updating product ${productId} to quantity ${quantity}`);
  console.log('Current cart:', req.session.cart);

  const cart = req.session.cart || [];
  const cartItem = cart.find(item => parseInt(item.product.id) === productId);

  if (!cartItem) {
    console.error('Cart item not found');
    return res.status(404).send('Cart item not found');
  }

  cartItem.quantity = quantity;

  const itemTotal = parseFloat(cartItem.product.price) * cartItem.quantity;
  const totalPrice = cart.reduce((total, item) => total + parseFloat(item.product.price) * item.quantity, 0);

  console.log(`Item total: ${itemTotal}, Total price: ${totalPrice}`);

  res.json({ itemTotal, totalPrice });
});

router.post('/remove/:id', (req, res) => {
  const productId = parseInt(req.params.id);

  req.session.cart = (req.session.cart || []).filter(item => parseInt(item.product.id) !== productId);

  res.redirect('/cart');
});

router.get('/cartOrder', cartController.getOrders);

module.exports = router;