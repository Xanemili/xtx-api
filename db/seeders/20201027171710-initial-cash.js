'use strict';
const {User, Ticker} = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {

    let user = await User.findOne({
      where: {username: 'Demo User'}
    })
    
    let ticker = await Ticker.findOne({
      where: {ticker: 'CASH'}
    })
    
    return queryInterface.bulkInsert('Ledger', [
      {
        userId: user.id,
        tickerId: ticker.id,
        price: 1.00,
        amount: 10000,
        tradeTotal: 10000,
        isOpen: true,
      },
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Ledger');
  }
};
