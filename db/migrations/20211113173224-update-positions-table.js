'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction( t => {
      return Promise.all([
        queryInterface.addColumn('Positions', 'wavg_cost', { type: Sequelize.FLOAT, allowNull: false, defaultValue: 0 }, {transaction: t}),
        queryInterface.renameColumn('Positions', 'amount', 'quantity',  {transaction: t})
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Positions', 'wavg_cost', {transaction: t}),
        queryInterface.renameColumn('Positions', 'quantity', 'amount', {transaction: t})
      ])
    })
  }
};
