// const {APIKEY} = require('../../../config/')
// const {
//   restClient
// } = require('polygon.io')
const fetch = require('node-fetch')

// const rest = restClient(APIKEY)

const checkTicker = async (ticker) => {
  const response = await fetch(`https://api.polygon.io/v1/meta/symbols/${ticker}/company?apiKey=${APIKEY}`)
  let tickers = await response.json()
  let result = {ticker: tickers.symbol, market: tickers.type, name: tickers.name}

  if(result){
    return result
  } else {
    return;
  }
}

module.exports = { checkTicker }
