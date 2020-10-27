const { sequelize } = require('./models');
const UserRepo = require('./user-functions');
const {Ticker, Ledger} = require('../db/models')

async function buy(details) {

  try {
    const result = await sequelize.transaction( async (buyTransaction)=> {

      const {username, ticker, price, amount} = details
      const {dataValues: {id}} = await UserRepo.findByUsername(username);
      const tickerObj = await Ticker.findOrCreate({ where: { ticker }});
      const tickerId = tickerObj[0].dataValues.id

      // const cashAvailable = await Ledger.find

      const trade = await Ledger.create({
        userId: id,
        tickerId,
        price,
        amount,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {transaction: buyTransaction});

      const cashtrade = await Ledger.create({
        userId: id,
        tickerId,
        price,
        amount: amount*-1,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {transaction: buyTransaction});

      return trade
    });

    return result;

  } catch (error) {
    console.log(error)
  }
}

async function sell(details) {
  const trade = await ledger.create()
}

module.exports = {
  buy,
  sell
}
