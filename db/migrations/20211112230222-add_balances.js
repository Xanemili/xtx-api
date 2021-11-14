'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Ledger', 'balance', { type: Sequelize.FLOAT })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Ledger', 'balance')
  }
};
