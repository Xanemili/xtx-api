const {api: {iex_sandbox}} = require('../../../config/')
const fetch = require('node-fetch')

const checkTicker = async (ticker) => {
  const response = await fetch(`https://sandbox.iexapis.com/stable/tops/last?symbols=${ticker}&token=${iex_sandbox}`)
  let tickers = await response.json()
  let result = {ticker: tickers[0].symbol, market: tickers[0].type}
  
  if(result){
    return result
  } else {
    return;
  }
}

module.exports = { checkTicker }
