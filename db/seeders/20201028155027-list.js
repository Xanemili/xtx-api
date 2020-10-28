'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Lists', [
      {id: 1, name: 'Watch List', description: "Stocks I am watching", userId: 1, createdAt: new Date(), updatedAt: new Date()},
      {id: 2, name: 'Second Watch List', description: "This is a second watchlist", userId: 1, createdAt: new Date(), updatedAt: new Date()}
    ], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Lists')
  }
};
