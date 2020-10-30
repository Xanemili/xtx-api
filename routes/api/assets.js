const express = require('express');
const asyncHandler = require('express-async-handler');
const {validationResult} = require('express-validator');
const { authenticated } = require('../utils/utils');
const fetch = require('node-fetch')

const router = express.Router()

router.get('/:asset', asyncHandler( async(req,res,next) => {

  const historicalData = await fetch(`https://api.polygon.io/v2/aggs/ticker/${req.params.asset}/range/1/day/2019-01-01/2019-02-01?sort=asc&apiKey=0sXWlN4BphrsPZEVMC1cWUKxM5lHx53z`)
  const data = await historicalData.json()
  const company = await fetch(`https://api.polygon.io/v1/meta/symbols/${req.params.asset}/company?apiKey=0sXWlN4BphrsPZEVMC1cWUKxM5lHx53z`);
  const companyInfo = await company.json()
  const news = await fetch(`https://api.polygon.io/v1/meta/symbols/${req.params.asset}/news?perpage=10&page=1&apiKey=0sXWlN4BphrsPZEVMC1cWUKxM5lHx53z`)
  const companyNews = await news.json()

  let asset = {
    data,
    companyInfo,
    companyNews
  }

  if(data && companyInfo){
    res.json(asset)
  } else {
    const err = Error('Security is not supported')
    err.errors = ['security is not supported']
    next (err)
  }

}));

module.exports = router;
