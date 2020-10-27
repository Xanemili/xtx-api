const { sequelize } = require('./models');
const UserRepo = require('./user-functions');
const {Ticker, Ledger, Holding} = require('../db/models')

async function buy(details) {

  try {
    const result = await sequelize.transaction( async (buyTransaction)=> {

      let {username, ticker, price, amount} = details
      const {dataValues: {id}} = await UserRepo.findByUsername(username);
      const tickerObj = await Ticker.findOrCreate({ where: { ticker }});
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
        createdAt: new Date(),
        updatedAt: new Date()
      }, {transaction: buyTransaction});

      const cashtrade = await Ledger.create({
        userId: id,
        tickerId: cash.tickerId,
        price,
        amount: amount*-1,
        tradeTotal: tradeTotal*-1,
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

async function sell(details) {
  try {
    const result = await sequelize.transaction( async (sellTransaction)=> {

      let {username, ticker, price, amount} = details
      const {dataValues: {id}} = await UserRepo.findByUsername(username);
      const tickerObj = await Ticker.findOne({ where: { ticker }});
      const tickerId = tickerObj[0].dataValues.id
      const security = await Holding.findOne({ where: { tickerId, userId: id}})
      const ledgerList = await Ledger.findAll({ where: { tickerId, userId: id}})


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
        createdAt: new Date(),
        updatedAt: new Date()
      }, {transaction: sellTransaction});

      const cashtrade = await Ledger.create({
        userId: id,
        tickerId: cash.tickerId,
        price,
        amount: amount,
        tradeTotal: tradeTotal,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {transaction: sellTransaction});

      const cash = await Holding.findOne({
        where: {
          userId: id,
          type: 'CASH'
        }
      })

      security[0].amount -= Number.parseInt(amount, 10);
      security[0].positionValue -= tradeTotal;
      security[0].positionCost -= tradeTotal;
      security[0].type = 'EQUITY';

      cash.amount -= tradeTotal;
      cash.positionCost -= tradeTotal;
      cash.positionValue -= tradeTotal;

      await security[0].save();
      await cash.save();

      return {trade, cashtrade}
    });

    return result;

  } catch (error) {
    const errorObj = {error}
    return errorObj
  }
}

module.exports = {
  buy,
  sell
}
