const { sequelize } = require('../../db/models');
const UserRepo = require('../utils/user-functions');
const { Ticker, Ledger, Holding } = require('../../db/models')

async function buy(details, id, tickerAPI) {
  const {
    ticker
  } = tickerAPI;

  let tickerObj = await Ticker.findOne({
    where: { ticker }
  });

  if (!tickerObj) {
    tickerObj = await Ticker.create({
      ticker: ticker,
    })
  }

  const result = await sequelize.transaction(async (buyTransaction) => {

    let { price, amount } = details
    price = parseInt(price)
    amount = parseInt(amount)

    const tickerId = tickerObj.dataValues.id
    const tradeTotal = amount * price;

    const cash = await Ledger.findAll({
      where: {
        tickerId: 1,
        userId: id
      },
      attributes: [[
        sequelize.fn('sum',
          sequelize.col('tradeTotal')),
        'total'
      ]],
      raw: true
    })

    if (cash[0].total - tradeTotal < 0) {
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
    }, { transaction: buyTransaction });

    const cashtrade = await Ledger.create({
      userId: id,
      tickerId: 1,
      price,
      amount: amount * -1,
      tradeTotal: tradeTotal * -1,
      isOpen: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }, { transaction: buyTransaction });

    return [trade, cashtrade]
  });

  return result;
}

async function sell(details, id, ticker) {

  const result = await sequelize.transaction(async (sellTransaction) => {

    let { price, amount } = details

    const tickerObj = await Ticker.findOne({ where: { ticker }, raw: true });
    const tickerId = tickerObj.id;
    const tradeTotal = amount * price;
    console.log('tried to sell !!!!')

    const openPositions = await Ledger.findAll({
      where: {
        tickerId: tickerId,
        userId: id,
        isOpen: true
      }
    })

    console.log(openPositions)
    let currentAmount = amount
    let unfilled = 0;
    let i = 0;
    while ( currentAmount > 0 && i < openPositions.length) {
      console.log(openPositions[i])
      if ( currentAmount >= openPositions[i].dataValues.amount) {
        currentAmount = currentAmount - openPositions[i].dataValues.amount;
        openPositions[i].isOpen = false;
        console.log(openPositions[i])
        openPositions[i].save()
        i++;
      } else {
        unfilled = openPositions[i].dataValues.amount - currentAmount;
        currentAmount = 0;
        break;
      }
    }

    console.log(currentAmount, unfilled)

    const trade = await Ledger.create({
      userId: id,
      tickerId,
      price,
      amount: (amount - unfilled) * -1,
      tradeTotal,
      isOpen: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }, { transaction: sellTransaction });

    const cashtrade = await Ledger.create({
      userId: id,
      tickerId: 1,
      price,
      amount: amount,
      isOpen: false,
      tradeTotal: tradeTotal,
      createdAt: new Date(),
      updatedAt: new Date()
    }, { transaction: sellTransaction });

    return { trade, cashtrade, unfilled }
  });

  return result;
}

const addCash = async (id) => {

  const cash = await Holding.findOne({ where: { userId: id, type: 'CASH' } })

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
