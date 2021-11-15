'use strict';
const {User, _Symbol} = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {

    let user = await User.findOne({
      where: {username: 'Demo User'}
    })

    let portfolioSymbol = await _Symbol.findOne({ where: { symbol: 'PORTVAL' }})

    const testPortfolio = []
    let portVal = 10000
    const date = new Date(2021, 9, 1)
    const today = new Date()

    while (date < today) {

      date.setDate(date.getDate() + 1)
      portVal = portVal * (1 + (Math.random() * 0.08) )

      testPortfolio.push({
        userId: user.id,
        price: portVal,
        quantity: 1,
        tradeTotal: portVal,
        isOpen: true,
        balance: portVal,
        symbolId: portfolioSymbol.id,
        createdAt: date,
        updatedAt: date,
      })
    }

    return queryInterface.bulkInsert('Ledger', testPortfolio, {})
  },

  down: async (queryInterface, Sequelize) => {

    let user = await User.findOne({
      where: {username: 'Demo User'}
    })

    return queryInterface.bulkDelete('Ledger',  { userId: user.id })
  }
};
