'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tickers', [
      {ticker: 'CASH', EODPrice: 1.00}, {ticker: 'MSFT', EODPrice: 123.33}, {ticker: 'AAPL', EODPrice: 111.1}
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tickers')
  }
};
