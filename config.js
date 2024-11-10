const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('productDB', 'myuser', 'vinh', {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = sequelize;