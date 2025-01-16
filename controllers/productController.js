const { Op } = require('sequelize');
const sequelize = require('../config'); // Import sequelize instance
const Product = require('../models/product')(sequelize, require('sequelize').DataTypes); // Import and initialize Product model
const multer = require('multer');
const path = require('path');

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets/img/menu/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

exports.getProductList = async (req, res) => {
  try {
    const { name, description, minPrice, maxPrice, difficulty, page = 1, limit = 4, sort = 'asc' } = req.query;
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

    const offset = (page - 1) * limit;
    const products = await Product.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['price', sort]]
    });

    res.render('productList', {
      products: products.rows,
      totalPages: Math.ceil(products.count / limit),
      currentPage: parseInt(page),
      sort
    });
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

    console.log('Search parameters:', { name, description, minPrice, maxPrice, difficulty });

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

    console.log('Where clause:', whereClause);

    const products = await Product.findAll({ where: whereClause });

    console.log('Products found:', products);

    res.render('productList', { products });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.getProductListJSON = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getFilteredProductsJSON = async (req, res) => {
  try {
    const { name, description, minPrice, maxPrice, difficulty, page = 1, limit = 4 } = req.query;
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

    const offset = (page - 1) * limit;
    const products = await Product.findAndCountAll({
      where: whereClause,
      limit,
      offset
    });

    res.json({
      products: products.rows,
      totalPages: Math.ceil(products.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.addProduct = [
  upload.single('image'),
  async (req, res) => {
    try {
      const { name, description, difficulty, price } = req.body;
      const image = req.file ? req.file.filename : null; // Save only the filename
      await Product.create({ name, image, description, difficulty, price });
      req.flash('success_msg', 'Product added successfully!');
      res.redirect('/products');
    } catch (error) {
      console.error('Error adding product:', error);
      req.flash('error_msg', 'Error adding product');
      res.redirect('/products/add');
    }
  }
];