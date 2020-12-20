
const fetch = require('node-fetch')

const fetchAsset = async (asset, range='1m', chartInterval=5, types=['quote', 'news', 'chart','company','peers']) => {
  
  const requestTypes = types.join(',')
  const responseAPI = await fetch(`https://sandbox.iexapis.com/stable/stock/${asset}/batch?types=${requestTypes}&range=${range}&last=10&token=Tsk_d83ce3387c9b44d99c7060e036faad15&chartInterval=${chartInterval}`)
  return responseAPI
}

const fetchTimeSeries = async (asset, range='1m', date='20201219') => {
  const responseAPI = await fetch(`https://sandbox.iexapis.com/stable/stock/${asset}/chart/${range}?token=Tsk_d83ce3387c9b44d99c7060e036faad15`)
  console.log(responseAPI)
  return responseAPI
}

module.exports ={
  fetchAsset,
  fetchTimeSeries
}