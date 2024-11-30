const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('productDB', 'postgres', 'vinh', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432
});

module.exports = sequelize;