const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/register', (req, res) => {
  res.render('registration');
});

router.post('/register', userController.registerUser);

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', userController.loginUser);

module.exports = router;