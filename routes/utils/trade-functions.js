const { sequelize } = require('../../db/models');
const UserRepo = require('../utils/user-functions');
const {Ticker, Ledger, Holding} = require('../../db/models')

async function buy(details, id, tickerAPI) {

  try {
    const result = await sequelize.transaction( async (buyTransaction)=> {

      const {
        ticker,
        name,
        market
      } = tickerAPI;

      const tickerObj = await Ticker.findOrCreate({
        where: {
        ticker
      },
      defaults: {
        market: market,
        name: name,
        ticker: ticker
      }});

      let {price, amount} = details

      const tickerId = tickerObj[0].dataValues.id

      const cash = await Holding.findOne(
        {
          where: {
            userId: id,
            type: 'CASH'
          }
        }
      )

      const tradeTotal = amount * price;

      if( cash.positionValue - tradeTotal < 0){
        throw new Error('Not enough cash');
      }

      const trade = await Ledger.create({
        userId: id,
        tickerId,
        price,
        amount,
        tradeTotal,
        isOpen: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {transaction: buyTransaction});

      const cashtrade = await Ledger.create({
        userId: id,
        tickerId: cash.tickerId,
        price,
        amount: amount*-1,
        tradeTotal: tradeTotal*-1,
        isOpen: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {transaction: buyTransaction});

      const security = await Holding.findOrCreate(
        { where: { tickerId, userId: id},
          defaults: {
          }
        })

      security[0].amount += Number.parseInt(amount, 10);
      security[0].positionValue += tradeTotal;
      security[0].positionCost += tradeTotal;
      security[0].type = 'EQUITY';

      cash.amount -= tradeTotal;
      cash.positionCost -= tradeTotal;
      cash.positionValue -= tradeTotal;


      await security[0].save();
      await cash.save();

      return [trade, cashtrade]
    });

    return result;

  } catch (error) {
    return {error}
  }
}

async function sell(details, id, ticker) {
  try {
    const result = await sequelize.transaction( async (sellTransaction)=> {

      let {price, amount} = details
      const tickerObj = await Ticker.findOne({ where: { ticker }});
      const tickerId = tickerObj.id;

      const security = await Holding.findOne({ where: { tickerId, userId: id}})
      const ledgerList = await Ledger.findAll({ where: { tickerId, userId: id, isOpen: true}})

      const cash = await Holding.findOne({
        where: {
          userId: id,
          type: 'CASH'
        }})

      const tradeTotal = amount * price;

      if( security.amount - amount < 0){
        throw new Error('Not enough shares');
      }

      const trade = await Ledger.create({
        userId: id,
        tickerId,
        price,
        amount: amount*-1,
        tradeTotal,
        isOpen: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {transaction: sellTransaction});

      const cashtrade = await Ledger.create({
        userId: id,
        tickerId: cash.tickerId,
        price,
        amount: amount,
        isOpen: false,
        tradeTotal: tradeTotal,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {transaction: sellTransaction});

      security.amount -= Number.parseInt(amount, 10);
      security.positionValue -= tradeTotal;
      security.positionCost -= tradeTotal;

      cash.amount += tradeTotal;
      cash.positionCost += tradeTotal;
      cash.positionValue += tradeTotal;

      await security.save();
      await cash.save();

      return {trade, cashtrade}
    });

    return result;

  } catch (error) {
    const errorObj = {error}
    return errorObj
  }
}

const addCash = async (id) => {

    const cash = await Holding.findOne({where: {userId: id, type: 'CASH'}})

    cash.amount += 1000;
    cash.positionValue += 1000;

    let price = 1.00;
    let amount = 1000;
    let isOpen = false;
    let tradeTotal = 1000;

    const cashtrade = await Ledger.create({
      userId: id,
      tickerId: cash.tickerId,
      price,
      amount,
      isOpen,
      tradeTotal,
    });

    await cash.save();

    return cashtrade
}

module.exports = {
  buy,
  sell,
  addCash
}
