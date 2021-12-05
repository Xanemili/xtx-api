'use strict'
const { response } = require('express')
const fetch = require('node-fetch')
const {promisify} =require('util')
const { pipeline } = require('stream');
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


const connectToSSE = async () => {
  const streamPipeline = promisify(pipeline);
  let partialMessage
  try {
  let stream = new fetch('https://cloud-sse.iexapis.com/stable/stocksUSNoUTP?token=pk_2641d7e4844e4281ac366edda6fe3cbe&symbols=spy,ibm,twtr', {
    headers: {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache',
    }
  })


    await streamPipeline(response.body)
  } catch (err) {
    console.error(err.stack)
  }

  stream.on('error', (err) => {
    console.log("Error", err);
    connect();
  });

  stream.on('data', (response) => {
    var chunk = response.toString();
    var cleanedChunk = chunk.replace(/data: /g, '');

    if (partialMessage) {
      cleanedChunk = partialMessage + cleanedChunk;
      partialMessage = "";
    }

    var chunkArray = cleanedChunk.split('\r\n\r\n');

    chunkArray.forEach(function (message) {
      if (message) {
        try {
          var quote = JSON.parse(message)[0];
          console.log(quote);
        } catch (error) {
          partialMessage = message;
        }
      }
    });
  });

  wait();

  return stream
}

function wait() {
  setTimeout(wait, 1000);
};

module.exports ={
  fetchAsset,
  fetchTimeSeries,
  fetchSearch,
  updateAssetPrices,
  fetchMarketLists,
  connectToSSE
}
