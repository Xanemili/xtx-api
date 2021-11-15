'use strict';
const {User, _Symbol} = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {

    let user = await User.findOne({
      where: {username: 'Demo User'}
    })

    let cashSymbol = await _Symbol.findOne({ where: { symbol: 'CASH' }})

    return queryInterface.bulkInsert('Positions', [{
      userId: user.id,
      symbolId: cashSymbol.id,
      quantity: 10000,
      wavg_cost: 1,
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    let user = await User.findOne({
      where: { username: 'Demo User' }
    })
    return queryInterface.bulkDelete('Positions', { userId: user.id})
  }
};
