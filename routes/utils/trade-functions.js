const { sequelize } = require('../../db/models');
const { Ticker, Ledger } = require('../../db/models')

async function buy(details, id) {

  let ticker = await Ticker.findOne({
    where: { ticker: details.ticker }
  });


  if (!ticker) {
    ticker = await Ticker.create({
      ticker: details.ticker,
    })
  }

  const result = await sequelize.transaction(async (buyTransaction) => {

    try {

      let { price, amount } = details

      const tickerId = ticker.dataValues.id
      const tradeTotal = amount * price;

      const cash = await Ticker.findAll({
        where: {
          ticker: 'CASH'
        },
        attributes: ['id','ticker',[sequelize.fn('sum', sequelize.col('Ledgers.tradeTotal')), 'total']],
        include: [{
          model: Ledger,
          where: {
           userId: id,
          },
        }],
        group: ['Ticker.id', 'Ledgers.id']
      })

      if (cash.total - tradeTotal < 0) {
        throw new Error('Not enough cash.');
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
        tickerId: cash[0].id,
        price,
        amount: tradeTotal * -1,
        tradeTotal: tradeTotal * -1,
        isOpen: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }, { transaction: buyTransaction });

      return [trade, cashtrade]
    } catch (e) {
      throw e
    }
  });

  return result;
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
