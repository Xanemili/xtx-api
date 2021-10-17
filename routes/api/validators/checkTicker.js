const {api: {iex_sandbox}} = require('../../../config/')
const fetch = require('node-fetch')

const checkTicker = async (ticker) => {
  const response = await fetch(`https://sandbox.iexapis.com/stable/tops/last?symbols=${ticker}&token=${iex_sandbox}`)

  let [ iex_ticker ] = await response.json()

  if ( iex_ticker) {
    return { iex_ticker: iex_ticker.symbol, iex_market: iex_ticker.type}
  } else {
    reject( new Error('Invalid Ticker. Please provide a valid ticker.') )
  }

}

module.exports = { checkTicker }
