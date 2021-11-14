'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    // https://github.com/sequelize/sequelize/issues/9295#issuecomment-494106823
    // postgres issue w/ autoincrementing. addressed by identifying the largest id in the db

    let symbols = [{symbol: 'CASH', market: 'CASH', name: 'CASH'}, {symbol: 'PORTVAL', market: 'PORTFOLIO', name: 'PORTFOLIO_VALUE'}]
    return queryInterface.bulkInsert('Symbols', symbols)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Symbols')
  }
};
