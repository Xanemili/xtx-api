'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction( t => {
      return Promise.all([
        queryInterface.renameTable('Watchlists', 'Users_Lists', { transaction: t }),
        queryInterface.renameColumn('Ledger', 'tickerId', 'symbolId', { transaction: t }),
        queryInterface.renameColumn('Symbols', 'ticker', 'symbol', { transaction: t }),
        queryInterface.renameColumn('Users_Lists', 'tickerId', 'symbolId', { transaction: t })
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction( t => {
      return Promise.all([
        queryInterface.renameColumn('Users_Lists', 'symbolId', 'tickerId', { transaction: t }),
        queryInterface.renameColumn('Symbols', 'symbol', 'ticker', { transaction: t }),
        queryInterface.renameColumn('Ledger', 'symbolId', 'tickerId', { transaction: t }),
        queryInterface.renameTable('Users_Lists', 'Watchlists', { transaction: t })
      ])
    })
  }
};
