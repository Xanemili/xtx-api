const {
  Ticker,
  Ledger,
  Holding
} = require('../../db/models')

const data = async() => {
  try{

    const security = await Holding.build({
      userId: 1,
      tickerId: 9,
      amount: 1000,
      positionCost: 1000,
      positionValue: 1000,
      type: 'test',
      updatedAt: new Date(),
      createdAt: new Date()
    })

    security.save()
  } catch (e){
    console.log(e)
  }


}

data()
