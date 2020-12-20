const express = require('express');
const asyncHandler = require('express-async-handler');
const {validationResult} = require('express-validator');
const { authenticated } = require('../utils/utils');
const fetch = require('node-fetch')
const {fetchAsset, fetchTimeSeries} = require('../utils/iex')

const router = express.Router()

router.get('/:asset/:date?', authenticated, asyncHandler( async(req,res,next) => {
  responseAPI = await fetchAsset(req.params.asset)
  console.log(responseAPI)
  if (responseAPI.ok) {
    const assetInfo = await responseAPI.json()

    if(assetInfo){
      res.json(assetInfo)
    } else {
      const err = Error('Security is not supported')
      err.errors = ['security is not supported']
      next (err)
    }
  } else {
    const err = Error('API is not responding.')
    err.errors = ['No API response.']
    next(err)
  }
}));

router.get('/timeseries/:asset/:range?', authenticated, asyncHandler(async(req, res, next) => {
  responseAPI = await fetchTimeSeries(req.params.asset, req.params.range)
  if (responseAPI.ok) {
    const timeSeries = await responseAPI.json()
    if (timeSeries) {
      res.json(timeSeries)
    } else {
      const err = Error('Timeseries data was not found')
      err.errors = ['No timeseries data for this time period']
      next(err)
    }
  } else {
    const err = Error('API Response Error')
    err.status = responseAPI.status
    err.errors = responseAPI.statusText
    next(err)
  }
}))

router.get('/search/:search', authenticated, asyncHandler( async(req, res, next) => {
  const url = `https://api.polygon.io/v2/reference/tickers?sort=ticker&search=${req.params.search}&perpage=10&page=1&apiKey=0sXWlN4BphrsPZEVMC1cWUKxM5lHx53z`
  const searchRes = await fetch(url);
  const data = await searchRes.json();

  if(data.status === 'OK'){
    res.json(data)
  } else {
    const err = Error('There was an error retrieving the data.');
    err.errors = ['Error in API provider.'];
    next(err);
  }
}))

router.get('/news/news', asyncHandler( async(req,res,next) => {

  const waiting = await fetch('https://newsapi.org/v2/top-headlines?apiKey=53eeb325d1d34dd19167158c3aa45798&language=en&category=business&country=us')
  const news = await waiting.json()
  res.json(news)
}))


module.exports = router;
