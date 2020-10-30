// const alpha = require('alphavantage')({
//   key: '1VQHQEGV3T5XK5SX'
// });

// alpha.data.intraday(`msft`).then(data => {
//   console.log(data);
// });
const fetch = require('node-fetch')
const {restClient} = require('polygon.io')

const rest = restClient('0sXWlN4BphrsPZEVMC1cWUKxM5lHx53z')
const getData = async() => {
  const data = await fetch('https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2019-01-01/2019-02-01?sort=asc&apiKey=0sXWlN4BphrsPZEVMC1cWUKxM5lHx53z')
  const res = await data.json()
  console.log(res)
}

getData();
