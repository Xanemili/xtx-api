'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('Holdings', [
      {
        userId: 1,
        tickerId: 1,
        type: 'CASH',
        amount: 10000,
        positionCost: 10000,
        positionValue: 10000,
      },
      {
        userId: 1,
        tickerId: 1,
        type: 'CASH',
        amount: 10,
        positionCost: 10,
        positionValue: 10,
      }
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Holdings');
  }
};
