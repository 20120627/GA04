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

module.exports = router;