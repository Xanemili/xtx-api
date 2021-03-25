'use strict'
const { Ledger, User, Ticker } = require('../db/models/')
const { Op } = require('sequelize')
const {updateAssetPrices} = require('../routes/utils/iex')

const updatePortfolioValuesDB = async () => {
  try {
    const users = await User.findAll({
      include: [
        {
          model: Ledger,
          where: {
            isOpen: true
          },
          include: [{
            model: Ticker,
            attributes: ['id', 'ticker', 'closePrice']
          }],
        }],
      attributes: ['username', 'id'],
      //tried to simplfy it with sql. failed. going to easy but inefficient mode for now.
      // attributes: {
      //   include: [
      //     sequelize.literal(`(
      //       SELECT SUM("Ledger".amount) AS total
      //       FROM "Ledger"
      //       WHERE "Ledger"."userId" = id
      //       GROUP BY "Ledger"."tickerId"
      //     )`)
      //   ]
      // },
    })
    for (let i = 0; i < users.length; i++) {
      let total = 0
      let cost = 0
      for (let j = 0; j < users[i].Ledgers.length; j++) {
        total = total + (users[i].Ledgers[j].amount * users[i].Ledgers[j].Ticker.closePrice)
        cost = cost + (users[i].Ledgers[j].tradeTotal)
      }
      let port = await Ledger.create({
        userId: users[i].id,
        tickerId: 2,
        tradeTotal: total,
        isOpen: false,
        amount: total,
        price: cost
      })
    }

    return
  } catch (e) {
    console.error(e)
  }
}

const retrieveEODAssetPrices = async() => {
  const tickers = await Ticker.findAll({
    where: {
      ticker: {
        [Op.notIn]: ['CASH', 'PORT_VAL']
    },
  },
    include: {
      model: Ledger,
      where: {
        isOpen: true,
      },
      attributes: []
    },
  })

  let iex_prices = await updateAssetPrices(tickers)

  for (let ticker of tickers) {
    ticker.closePrice = iex_prices[ticker.ticker].price
    await ticker.save()
  }
}

module.exports = {
  updatePortfolioValuesDB,
  retrieveEODAssetPrices
}
