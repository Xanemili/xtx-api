'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.changeColumn('Ledger', 'amount', {
        type: Sequelize.FLOAT(2)
      })
    ]
  },
  down: (queryInterface, Sequelize) => {
    return [
      queryInterface.changeColumn('Ledger', 'amount',
      {
        type: Sequelize.Integer
      })
    ]
  }
}