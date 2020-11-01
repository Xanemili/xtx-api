const express = require('express');
const asyncHandler = require('express-async-handler');
const {validationResult} = require('express-validator');
const { authenticated } = require('../utils/utils');
const fetch = require('node-fetch')

const router = express.Router()

router.get('/:asset', authenticated, asyncHandler( async(req,res,next) => {

  const company = await fetch(`https://api.polygon.io/v1/meta/symbols/${req.params.asset}/company?apiKey=0sXWlN4BphrsPZEVMC1cWUKxM5lHx53z`);
  const companyInfo = await company.json()
  const news = await fetch(`https://api.polygon.io/v1/meta/symbols/${req.params.asset}/news?perpage=10&page=1&apiKey=0sXWlN4BphrsPZEVMC1cWUKxM5lHx53z`)
  const companyNews = await news.json()

  let asset = {
    companyInfo,
    companyNews
  }

  if(companyInfo && companyNews){
    res.json(asset)
  } else {
    const err = Error('Security is not supported')
    err.errors = ['security is not supported']
    next (err)
  }

}));

router.get('/:asset/historical/:start/:end', authenticated,  asyncHandler( async(req,res,next) => {
  const url = `https://api.polygon.io/v2/aggs/ticker/` + `${req.params.asset}` + `/range/1/day/` + `${req.params.start}` + `/${req.params.end}?sort=asc&apiKey=0sXWlN4BphrsPZEVMC1cWUKxM5lHx53z`
  const historicalData = await fetch(url)
  const data = await historicalData.json();

  if(data) {
    res.json(data);
  } else {
    const err = Error('There was an error retrieving the data.');
    err.errors = ['Error in API provider.'];
    next (err);
  }
}))

router.get('/search/:search', asyncHandler( async(req, res, next) => {
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

module.exports = router;
