const {api} = require('../../../config')
const fetch = require('node-fetch')

const checkSymbol = async (symbol) => {
  const response = await fetch(`${api.iex_base_url}/stock/${symbol}/quote?token=${api.iex_secret}`)

  let iex_symbol = await response.json()

  if ( iex_symbol) {
    return iex_symbol
  } else {
    reject( new Error('Invalid Symbol. Please provide a valid symbol.') )
  }

}

module.exports = { checkSymbol }
