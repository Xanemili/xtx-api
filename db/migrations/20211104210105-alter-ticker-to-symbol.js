'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.renameTable('Tickers', 'Symbols')
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.renameTable('Symbols', 'Tickers') 
  }
};
