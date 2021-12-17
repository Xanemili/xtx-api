const { sequelize } = require('../../db/models');
const { _Symbol, Ledger, Position } = require('../../db/models');

async function buy(details, id, symbol) {

  try {
    const trade_status = await sequelize.transaction(async (buyTransaction) => {

      let { price, quantity } = details

      const symbolId = symbol.id
      const tradeTotal = quantity * price;

      const cash = await Position.findOne({
        where: { userId: id, },
        include: {
          model: _Symbol,
          where: { symbol: 'CASH'}
        }
      })

      const balance = cash.quantity - tradeTotal

      if (balance < 0) {
        throw new Error('Not enough cash.');
      }

      const trade = await Ledger.create({
        userId: id,
        symbolId,
        price,
        quantity,
        tradeTotal,
        balance: balance,
        isOpen: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }, { transaction: buyTransaction });

      let position = await Position.findOne({
        where: {
          symbolId: symbol.id,
          userId: id,
        }
      })

      if (position) {
        const totalCost = position.wavg_cost * position.quantity
        position.quantity = position.quantity + quantity
        position.wavg_cost = (totalCost + tradeTotal) / (position.quantity)
        await position.save({ fields: ['wavg_cost', 'quantity'], transaction: buyTransaction })
      } else {
        const wavg_cost = tradeTotal / quantity
        position = await Position.create({
          userId: id,
          symbolId,
          quantity,
          wavg_cost
        }, {transaction: buyTransaction })
      }


      // complete the cash transaction
      cash.quantity = balance
      await cash.save({ fields: ['quantity'], transaction: buyTransaction })

      return [trade, position]
    });

      return trade_status
    } catch (e) {
      throw e
    }
}



async function sell(details, id) {

  let { price, quantity, symbol : symbol_name } = details

  const symbol = await _Symbol.findOne({ where: { symbol_name }});

  if (!symbol) throw new Error('Symbol is not supported.')

  const tickerId = tickerObj.id;
  const tradeTotal = quantity * price;

  const openPositions = await Ledger.findAll({
    where: {
      tickerId: tickerId,
      userId: id,
      isOpen: true
    }
  })

  let position = await Position.findOne({
    where: {
      userId: id,
      symbolId: symbol.id
    }
  })

  if (openPositions.length === 0) {
    throw new Error('Attempted to sell too many shares.')
  }

  try {

    const result = await sequelize.transaction(async (sellTransaction) => {

      let currentQuantity = quantity
      let unfilled = 0;
      let i = 0;

      while (currentQuantity > 0 && i < openPositions.length) {
        console.log(openPositions[i])
        if (currentQuantity >= openPositions[i].quantity) {
          currentQuantity = currentQuantity - openPositions[i].quantity;
          openPositions[i].isOpen = false;
          console.log(openPositions[i])
          openPositions[i].save()
          i++;
        } else {
          unfilled = openPositions[i].dataValues.quantity - currentQuantity;
          currentQuantity = 0;
          break
        }
      }

      const trade = await Ledger.create({
        userId: id,
        tickerId,
        price,
        quantity: (quantity - unfilled) * -1,
        tradeTotal,
        isOpen: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }, { transaction: sellTransaction });

      position.quantity = position.quantity + trade.quantity
      position.wavg_cost

      return [ trade, cashtrade, unfilled ]
    });
    return result
  } catch (err) {
    throw err
  }
}

const addCash = async (id) => {

  let cash = await _Symbol.findOne({ where: { symbol: 'CASH' } })

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
