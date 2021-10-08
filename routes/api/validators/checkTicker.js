const {api: {iex_sandbox}} = require('../../../config/')
const fetch = require('node-fetch')

const checkTicker = async (ticker) => {
  const response = await fetch(`https://sandbox.iexapis.com/stable/tops/last?symbols=${ticker}&token=${iex_sandbox}`)
<<<<<<< HEAD

  let [ iex_ticker ] = await response.json()

  if ( iex_ticker) {
    return { iex_ticker: iex_ticker.symbol, iex_market: iex_ticker.type}
=======
  let tickers = await response.json()
  let result = {ticker: tickers[0].symbol, price: tickers[0].price}
  
  if(result){
    return result
>>>>>>> c2793cc90cfb7545804bced563ab7ecd492607d9
  } else {
    reject( new Error('Invalid Ticker. Please provide a valid ticker.') )
  }

}

module.exports = { checkTicker }
