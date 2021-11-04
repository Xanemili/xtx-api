'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.changeColumn('Ledger', 'amount', {
        type: Sequelize.FLOAT(2)
      })
    ]
  },
  down: async (queryInterface, Sequelize) => {
    return [
      await queryInterface.changeColumn('Ledger', 'amount',
      {
        type: Sequelize.INTEGER()
      })
    ]
  }
}