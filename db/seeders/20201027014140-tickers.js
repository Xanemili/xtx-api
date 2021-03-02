'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    let tickers = [{ticker: 'CASH', market: 'CASH', name: 'CASH'}, {ticker: 'PORT_VAL', market: 'PORT', name: 'PORTFOLIO_VALUE'}]

    return queryInterface.bulkInsert('Tickers', tickers)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tickers')
  }
};
