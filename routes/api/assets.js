const express = require('express');
const asyncHandler = require('express-async-handler');
const {validationResult} = require('express-validator');
const { authenticated } = require('../utils/utils');
const {fetchAsset, fetchTimeSeries, fetchSearch, fetchMarketLists} = require('../utils/iex')

const router = express.Router()

router.get('/search/:search', asyncHandler( async(req, res, next) => {
  let searchResults = await fetchSearch(req.params.search)

  if(searchResults.ok){
    res.json(searchResults.data)
  } else {
    const err = Error('There was an error retrieving the data.');
    err.errors = ['Error in API provider.'];
    next(err);
  }
}))

router.get('/movers', asyncHandler(async (req, res, next) => {
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
  try {
    const asset = await fetchAsset(req.params.asset)

    if(asset.ok){
      res.json(asset.data)
    } else {
      const err = Error('Security is not supported')
      err.errors = ['security is not supported']
      next (err)
    }
  } catch(err) {
    next(err)
  }
}));

router.get('/timeseries/:asset/:range?/:interval?', authenticated, asyncHandler(async(req, res, next) => {
  try {

    const responseAPI = await fetchTimeSeries(req.params.asset, req.params.range, req.params.interval)
    if (responseAPI.ok) {
      if (responseAPI) {
        res.json(responseAPI.data)
      } else {
        const err = Error('Timeseries data was not found')
        err.errors = ['No timeseries data for this time period']
        next(err)
      }
    }
  } catch (err) {
    next(err)
  }
}))

module.exports = router;
