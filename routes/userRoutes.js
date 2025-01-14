const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const userController = require('../controllers/userController');

router.get('/register', (req, res) => {
  res.render('registration');
});

router.post('/register', userController.registerUser);

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/products',
  failureRedirect: '/users/login',
  failureFlash: true
}));

router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

router.get('/logout', userController.logoutUser);

router.get('/check-username', async (req, res) => {
  const { username } = req.query;
  const user = await User.findOne({ where: { username } });
  res.json({ available: !user });
});

router.get('/check-email', async (req, res) => {
  const { email } = req.query;
  const user = await User.findOne({ where: { email } });
  res.json({ available: !user });
});

module.exports = router;