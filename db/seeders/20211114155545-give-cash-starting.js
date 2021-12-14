'use strict';
const {User, _Symbol} = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let cashSymbol = await _Symbol.findOne({ where: { symbol: 'CASH' }})
    cashSymbol.closePrice = 1
    cashSymbol.openPrice = 1
    return await cashSymbol.save()
  },

  down: async (queryInterface, Sequelize) => {
    let cashSymbol = await _Symbol.findOne({
      where: {
        symbol: 'CASH'
      }
    })
    cashSymbol.closePrice = null
    cashSymbol.openPrice = null
    return await cashSymbol.save()
  }
};
