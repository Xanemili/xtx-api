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
    const today = new Date()
    const date = new Date(today.getFullYear(), today.getMonth()-1, today.getDate())
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
        updatedAt: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      })
    }

    return queryInterface.bulkInsert('Ledger', testPortfolio)
  },

  down: async (queryInterface, Sequelize) => {

    let user = await User.findOne({
      where: {username: 'Demo User'}
    })

    return queryInterface.bulkDelete('Ledger',  { userId: user.id })
  }
};
