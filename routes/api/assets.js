const express = require('express');
const asyncHandler = require('express-async-handler');
const {validationResult} = require('express-validator');
const { authenticated } = require('../utils/utils');
const fetch = require('node-fetch')

const router = express.Router()

router.get('/:asset/:date/:range', authenticated, asyncHandler( async(req,res,next) => {

  const responseAPI = await fetch(`https://sandbox.iexapis.com/stable/stock/${req.params.asset}/batch?types=quote,news,chart&range=${req.params.range}&token=Tsk_d83ce3387c9b44d99c7060e036faad15&chartInterval=5`);
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
