const { Order, Product } = require('../models'); // Adjust the path as necessary

exports.createOrder = async (req, res) => {
  const location = req.body.location;
  const products = JSON.parse(req.body.products);
  const totalPrice = req.body.totalPrice;
  const orderTime = req.body.orderTime;
  const userId = req.user.id; // Assuming user is authenticated and user ID is available in req.user

  try {
    const orders = await Promise.all(products.map(async item => {
      const order = await Order.create({
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
        location: location,
        order_date: orderTime
      });
      return order;
    }));

    // Clear the cart after order is created
    req.session.cart = [];

    res.redirect('/cart/cartOrder');
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [Product]
    });

    res.render('cartOrder', { orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('Internal Server Error');
  }
};