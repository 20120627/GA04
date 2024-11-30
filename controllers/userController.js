const bcrypt = require('bcrypt');
const sequelize = require('../config'); // Import sequelize instance
const User = require('../models/user')(sequelize, require('sequelize').DataTypes); // Import and initialize User model

exports.registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render('registration', { error: 'Username and password are required' });
  }

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.render('registration', { error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ username, password: hashedPassword });

    res.redirect('/products');
  } catch (error) {
    console.error('Error registering user:', error);
    res.render('registration', { error: 'Internal Server Error' });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.render('login', { error: 'Username and password are required' });
  }

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.render('login', { error: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { error: 'Invalid username or password' });
    }
    
    res.redirect('/products');
  } catch (error) {
    console.error('Error logging in user:', error);
    res.render('login', { error: 'Internal Server Error' });
  }
};

exports.logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};