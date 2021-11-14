const {api: {iex_sandbox}} = require('../../../config')
const fetch = require('node-fetch')

const checkSymbol = async (symbol) => {
  const response = await fetch(`https://sandbox.iexapis.com/stable/tops/last?symbols=${symbol}&token=${iex_sandbox}`)

  let [ iex_symbol ] = await response.json()

  if ( iex_symbol) {
    return { iex_symbol: iex_symbol.symbol, iex_market: iex_symbol.type}
  } else {
    reject( new Error('Invalid Symbol. Please provide a valid symbol.') )
  }

}

module.exports = { checkSymbol }
