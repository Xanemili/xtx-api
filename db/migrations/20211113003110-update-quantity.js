'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('Ledger', 'amount', 'quantity')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('Ledger', 'quantity', 'amount')
  }
};
