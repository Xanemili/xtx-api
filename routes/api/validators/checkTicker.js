const {APIKEY} = require('../../../config/')
const {
  restClient
} = require('polygon.io')
const fetch = require('node-fetch')

const rest = restClient(APIKEY)

const checkTicker = async (ticker) => {
  const response = await fetch(`https://api.polygon.io/v2/reference/tickers?sort=ticker&search=${ticker}&perpage=3&page=1&apiKey=${APIKEY}`)
  let tickers = await response.json()
  let result = tickers.tickers.filter( symbol => symbol.ticker === ticker);
  if(result.length === 1){
    return result[0]
  } else {
    return;
  }
}

module.exports = { checkTicker }
