const { Op } = require('sequelize');
const sequelize = require('../config'); // Import sequelize instance
const Product = require('../models/product')(sequelize, require('sequelize').DataTypes); // Import and initialize Product model

exports.getProductList = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.render('productList', { products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getProductDetail = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).send('Product not found');
    }

    const otherProducts = await Product.findAll({
      where: {
        id: { [Op.ne]: req.params.id }
      },
      limit: 5 
    });

    res.render('productDetail', { product, otherProducts });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { name, description, minPrice, maxPrice, difficulty } = req.query;
    const whereClause = {};

    if (name) {
      whereClause.name = { [Op.iLike]: `%${name}%` };
    }
    if (description) {
      whereClause.description = { [Op.iLike]: `%${description}%` };
    }
    if (minPrice) {
      whereClause.price = { [Op.gte]: minPrice };
    }
    if (maxPrice) {
      whereClause.price = { [Op.lte]: maxPrice };
    }
    if (difficulty) {
      whereClause.difficulty = difficulty;
    }

    const products = await Product.findAll({ where: whereClause });
    res.render('productList', { products });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).send('Internal Server Error');
  }
};