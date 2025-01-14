const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { User } = require('../models');
const userController = require('../controllers/userController');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });

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

// Add the new route for userInfo.ejs
router.get('/info', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/users/login');
  }
  res.render('userInfo', { user: req.user });
});
router.get('/forgot-password', (req, res) => {
  res.render('forgotPassword');
});

router.post('/forgot-password', userController.forgotPassword);

router.post('/update-profile', upload.single('avatar'), userController.updateProfile);

module.exports = router;