'use strict';
const {User, _Symbol} = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {

    let user = await User.findOne({
      where: {username: 'Demo User'}
    })

    let symbol = await _Symbol.findOne({
      where: {symbol: 'CASH'}
    })

    return queryInterface.bulkInsert('Ledger', [
      {
        userId: user.id,
        symbolId: symbol.id,
        price: 1.00,
        quantity: 10000,
        tradeTotal: 10000,
        isOpen: true,
      },
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Ledger');
  }
};
