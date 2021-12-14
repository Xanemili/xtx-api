'use strict'
const { Ledger, User, _Symbol, Position } = require('../db/models/')
const { Op } = require('sequelize')
const {updateAssetPrices} = require('../routes/utils/iex')

const updatePortfolioValuesDB = async () => {
  try {
    const portval = await _Symbol.findOne({
      where: {
        symbol: 'PORTVAL'
      }
    })

    const users = await User.findAll({
      include: [
        {
          model: Position,
          include: [{
            model: _Symbol,
            attributes: ['id', 'symbol', 'closePrice']
          }],
        }],
      attributes: ['username', 'id'],
    })

    for (let i = 0; i < users.length; i++) {
      let total = 0
      let cost = 0

      for (let j = 0; j < users[i].Positions.length; j++) {
        total = total + (users[i].Positions[j].quantity * users[i].Positions[j]._Symbol.closePrice)
      }

      await Ledger.create({
        userId: users[i].id,
        symbolId: portval.id,
        tradeTotal: total,
        isOpen: false,
        amount: total,
        price: 1 //unsure how to use this col for portvals
      })
    }

    return
  } catch (e) {
    console.log(e)
    Promise.reject(e)
  }
}

const retrieveEODAssetPrices = async() => {
  const symbols = await _Symbol.findAll({
    where: {
      symbol: {
        [Op.notIn]: ['CASH', 'PORTVAL']
      },
    },
  })

  let iex_prices = await updateAssetPrices(symbols)
  console.log(iex_prices)
  try {

    for (let symbol of symbols) {
      const { quote } = iex_prices.data[symbol.symbol]
      if (!symbol.name) {
        symbol.name = quote.companyName
      }
      symbol.set({
        closePrice: quote.close,
        openPrice: quote.open,
        latestUpdate: quote.latestUpdate
      })
      console.log(symbol)
      symbol.closePrice = quote.latestPrice
      await symbol.save()
    }
  } catch(e) {
    Promise.reject(e)
  }
}

module.exports = {
  updatePortfolioValuesDB,
  retrieveEODAssetPrices
}
