'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.addColumn('Tickers','openPrice', {type: Sequelize.FLOAT}),
      await queryInterface.addColumn('Tickers','closePrice', {type: Sequelize.FLOAT}),
      await queryInterface.addColumn('Tickers','latestUpdate', {type: Sequelize.FLOAT})
    ]
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Tickers', 'openPrice'),
      queryInterface.removeColumn('Tickers','closePrice'),
      queryInterface.removeColumn('Tickers','latestUpdate')
    ])
  }
};
