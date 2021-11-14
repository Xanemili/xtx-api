const express = require('express');
const asyncHandler = require('express-async-handler');
const {validationResult} = require('express-validator');
const { authenticated } = require('../utils/utils');
const {fetchAsset, fetchTimeSeries, fetchSearch, fetchMarketLists} = require('../utils/iex')
const config = require('../../config')

const router = express.Router()

router.get('/search/:search', asyncHandler( async(req, res, next) => {
  console.log(req.params.search)
  let searchResults = await fetchSearch(req.params.search)

  if(searchResults){
    res.json(searchResults)
  } else {
    const err = Error('There was an error retrieving the data.');
    err.errors = ['Error in API provider.'];
    next(err);
  }
}))

router.get('/movers', asyncHandler(async (req, res, next) => {
  console.log(config)
  try {
    const gainers = await fetchMarketLists('gainers')
    const losers = await fetchMarketLists('losers')
    res.json({
      gainers: gainers.data,
      losers: losers.data
    })

  } catch (err) {
    next(err)
  }
}))

router.get('/:asset/:date?', authenticated, asyncHandler( async(req,res,next) => {
  responseAPI = await fetchAsset(req.params.asset)
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
    const err = Error('API error.')
    err.errors = [responseAPI.statusText]
    next(err)
  }
}));

router.get('/timeseries/:asset/:range?/:interval?', authenticated, asyncHandler(async(req, res, next) => {
  responseAPI = await fetchTimeSeries(req.params.asset, req.params.range, req.params.interval)
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

module.exports = router;
