'use strict'
const fetch = require('node-fetch')
const iexBaseUrl = 'https://cloud.iexapis.com/stable'
const iexBaseTest = 'https://sandbox.iexapis.com/stable'

const fetchAsset = async (asset, range='1m', chartInterval=5, types=['quote', 'news', 'chart','company','peers']) => {
  const requestTypes = types.join(',')
  const responseAPI = await fetch(`${iexBaseUrl}/stock/${asset}/batch?types=${requestTypes}&range=${range}&last=10&token=Tsk_d83ce3387c9b44d99c7060e036faad15&chartInterval=${chartInterval}`)
  return responseAPI
}

const fetchTimeSeries = async (asset, range='1m', interval=1) => {
  const responseAPI = await fetch(`${iexBaseUrl}/stock/${asset}/chart/${range}?token=Tsk_d83ce3387c9b44d99c7060e036faad15&chartInterval=${interval}`)
  return responseAPI
}

const fetchSearch = async(searchTerm) => {
  const responseAPI = await fetch(`${iexBaseUrl}/search/${searchTerm}?token=Tsk_d83ce3387c9b44d99c7060e036faad15`)
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

const fetchMarketLists = async( type ) => {
  const responseAPI = await fetch(`${iexBaseTest}/stock/market/list/${type}?token=Tsk_d83ce3387c9b44d99c7060e036faad15`)
  return responseAPI
}

module.exports ={
  fetchAsset,
  fetchTimeSeries,
  fetchSearch,
  updateAssetPrices,
  fetchMarketLists,
}
