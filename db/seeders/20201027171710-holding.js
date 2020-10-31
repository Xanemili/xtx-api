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
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Holdings');
  }
};
