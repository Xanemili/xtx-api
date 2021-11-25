'use strict'
const fetch = require('node-fetch')
const { api } = require('../../config')

const parseIex = async (response) => {
  if (response.ok) {
    const data = await response.json()
    return { ok: true, data }
  } else {
    const err = new Error(`IEX: ${response.status} - ${response.statusText}`)
    err.status = 503
    throw err
  }
}

const fetchAsset = async (asset, types=['quote','company',]) => {
  const requestTypes = types.join(',')
  const responseAPI = await fetch(`${api.iex_base_url}/stock/${asset}/batch?types=${requestTypes}&token=${api.iex_secret}`)
  return parseIex(responseAPI)
}

const fetchTimeSeries = async (asset, range='1m', interval=1) => {
  const responseAPI = await fetch(`${api.iex_base_url}/stock/${asset}/chart/${range}?token=${api.iex_secret}&chartInterval=${interval}`)
  return parseIex(responseAPI)
}

const fetchSearch = async(searchTerm) => {
  const responseAPI = await fetch(`${api.iex_base_url}/search/${searchTerm}?token=${api.iex_secret}`)
  return parseIex(responseAPI)
}

const updateAssetPrices = async(symbols) => {

  // IEX has limit of 100 symbols in api call. May need to address is db grows large enough.
  let symbol_string = symbols.reduce( (acc, ele, index) =>
  {
    if(index === 0){
      return `${ele.symbol}`
    }
    return acc + `,${ele.symbol}`
  },'')
  const responseAPI = await fetch(`${api.iex_base_url}/stock/market/batch?symbols=${symbol_string}&types=quote&token=${api.iex_secret}`)
  return parseIex(responseAPI)
}

const fetchMarketLists = async(type) => {
  const responseAPI = await fetch(`${api.iex_base_url}/stock/market/list/${type}?token=${api.iex_secret}`)
  return parseIex(responseAPI)
}

module.exports ={
  fetchAsset,
  fetchTimeSeries,
  fetchSearch,
  updateAssetPrices,
  fetchMarketLists,
}
