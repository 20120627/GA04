const bcrypt = require('bcrypt');
const sequelize = require('../config'); // Import sequelize instance
const User = require('../models/user')(sequelize, require('sequelize').DataTypes); // Import and initialize User model
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

exports.registerUser = async (req, res) => {
  const { fullname, username, email, password, avatar } = req.body;

  if (!fullname || !username || !email || !password) {
    return res.render('registration', { error: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.render('registration', { error: 'Username already exists' });
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.render('registration', { error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ fullname, username, email, password: hashedPassword, avatar });

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

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.render('forgotPassword', { error: 'Email is required' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.render('forgotPassword', { error: 'No account with that email found' });
    }

    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    await user.update({ password: hashedPassword });

    res.render('forgotPassword', { success: `Your new temporary password is: ${tempPassword}` });
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.render('forgotPassword', { error: 'Internal Server Error' });
  }
};

exports.updateProfile = async (req, res) => {
  const { fullname, email, password } = req.body;
  const avatar = req.file;

  if (!fullname || !email) {
    return res.status(400).json({ error: 'Full name and email are required' });
  }

  try {
    const user = await User.findByPk(req.user.id);

    if (avatar) {
      const avatarPath = path.join(__dirname, '../public/uploads', avatar.filename);
      fs.renameSync(avatar.path, avatarPath);
      user.avatar = `/uploads/${avatar.filename}`;
    }

    user.fullname = fullname;
    user.email = email;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.json({ success: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};