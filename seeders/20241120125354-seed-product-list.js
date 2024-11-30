'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('productList', [
      {
        name: 'Product 1',
        image: 'menu-item-1.png',
        description: 'Description for product 1',
        difficulty: 'Easy',
        price: 10.00,
      },
      {
        name: 'Product 2',
        image: 'menu-item-2.png',
        description: 'Description for product 2',
        difficulty: 'Medium',
        price: 20.00,
      },
      {
        name: 'Product 3',
        image: 'menu-item-3.png',
        description: 'Description for product 3',
        difficulty: 'Hard',
        price: 30.00,
      },
      {
        name: 'Product 4',
        image: 'menu-item-4.png',
        description: 'Description for product 4',
        difficulty: 'Easy',
        price: 40.00,
      },
      {
        name: 'Product 5',
        image: 'menu-item-5.png',
        description: 'Description for product 5',
        difficulty: 'Medium',
        price: 50.00,
      },
      {
        name: 'Product 6',
        image: 'menu-item-6.png',
        description: 'Description for product 6',
        difficulty: 'Hard',
        price: 60.00,
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('productList', null, {});
  }
};
