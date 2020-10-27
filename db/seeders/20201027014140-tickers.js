'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tickers', [
      {ticker: 'CASH'}, {ticker: 'MSFT'}, {ticker: 'AAPL'}
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tickers')
  }
};
