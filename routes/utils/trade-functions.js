const { sequelize } = require('../../db/models');
const { _Symbol, Ledger, Position } = require('../../db/models');

async function buy(details, id) {

  let symbol = await _Symbol.findOne({
    where: { symbol: details.symbol }
  });


  if (!symbol) {
    symbol = await _Symbol.create({
      symbol: details.symbol,
    })
  }

  try {
    await sequelize.transaction(async (buyTransaction) => {

      let { price, amount } = details

      const symbolId = symbol.id
      const tradeTotal = amount * price;

      const cash = await Position.findOne({
        where: { userId: user.id, },
        include: _Symbol
      })

      if (cash.amount - tradeTotal < 0) {
        throw new Error('Not enough cash.');
      }

      const trade = await Ledger.create({
        userId: id,
        symbolId,
        price,
        quantity,
        tradeTotal,
        balance,
        isOpen: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, { transaction: buyTransaction });

      let position = await Position.findOne({
        include: [{ model: Symbol, where: { symbol: symbol }, required: true }],
      })

      if (position) {
        const totalCost = position.wavg_cost * position.quantity
        position.quantity = position.quantity + quantity
        position.wavg_cost = (totalCost + tradeTotal) / (position.quantity)
        await position.save({ fields: ['wavg_cost', 'quantity']}, {transaction: buyTransaction})
      } else {

        const wavg_cost = tradeTotal / quantity
        position = await Position.create({
          userId: id,
          symbolId,
          quantity,
          wavg_cost
        })
      }

      // complete the cash transaction
      cash.quantity = cash.quantity - tradeTotal
      await cash.save({ fields: ['quantity']}, { transaction: buyTransaction })

      return trade
    });
    } catch (e) {
      throw e
    }
}



async function sell(details, id, ticker) {

  let { price, amount } = details

  const tickerObj = await Ticker.findOne({ where: { ticker }, raw: true });
  const tickerId = tickerObj.id;
  const tradeTotal = amount * price;

  const openPositions = await Ledger.findAll({
    where: {
      tickerId: tickerId,
      userId: id,
      isOpen: true
    }
  })

  const result = await sequelize.transaction(async (sellTransaction) => {

    let currentAmount = amount
    let unfilled = 0;
    let i = 0;

    if (openPositions.length === 0) {
      throw new Error('Attempted to sell too many shares.')
    }

    while (currentAmount > 0 && i < openPositions.length) {
      console.log(openPositions[i])
      if (currentAmount >= openPositions[i].dataValues.amount) {
        currentAmount = currentAmount - openPositions[i].dataValues.amount;
        openPositions[i].isOpen = false;
        console.log(openPositions[i])
        openPositions[i].save()
        i++;
      } else {
        unfilled = openPositions[i].dataValues.amount - currentAmount;
        currentAmount = 0;
      }
    }

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
      isOpen: true,
      tradeTotal: tradeTotal,
      createdAt: new Date(),
      updatedAt: new Date()
    }, { transaction: sellTransaction });

    return { trade, cashtrade, unfilled }
  });

  return result;
}

const addCash = async (id) => {

  let cash = await Ticker.findOne({ where: { ticker: 'CASH' } })

  const cashtrade = await Ledger.create({
    userId: id,
    tickerId: cash.id,
    price: 1.00,
    amount: 1000,
    isOpen: true,
    tradeTotal: 1000,
  });

  return cashtrade
}

module.exports = {
  buy,
  sell,
  addCash
}
