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
  return responseAPI
}

const fetchTimeSeries = async (asset, range='1m', interval=1) => {
  const responseAPI = await fetch(`${api.iex_base_url}/stock/${asset}/chart/${range}?token=Tsk_d83ce3387c9b44d99c7060e036faad15&chartInterval=${interval}`)
  return responseAPI
}

const fetchSearch = async(searchTerm) => {
  const responseAPI = await fetch(`${api.iex_base_url}/search/${searchTerm}?token=Tsk_d83ce3387c9b44d99c7060e036faad15`)
  console.log(responseAPI)
  if (responseAPI.ok){
    let res = await responseAPI.json()
    return res
  }
}

const updateAssetPrices = async(tickers) => {
  let ticker_string = tickers.reduce( (acc, ele, index) =>
  {
    if(index === 0){
      return `${ele.ticker}`
    }
    return acc + `,${ele.ticker}`
  },'')
  const responseAPI = await fetch(`${iexBaseUrl}/stock/market/batch?symbols=${ticker_string}&types=price&token=Tsk_d83ce3387c9b44d99c7060e036faad15`)
  let price_list = await responseAPI.json()
  return price_list
}

const fetchMarketLists = async(type) => {
  const responseAPI = await fetch(`${api.iex_base_url}/stock/marke/list/${type}?token=${api.iex_secret}`)
  return parseIex(responseAPI)
  
}

module.exports ={
  fetchAsset,
  fetchTimeSeries,
  fetchSearch,
  updateAssetPrices,
  fetchMarketLists,
}
