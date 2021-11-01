const express = require('express');
const asyncHandler = require('express-async-handler');
const { authenticated } = require('../utils/utils');
const fetch = require('node-fetch')

const router = express.Router()

router.get('/', authenticated, asyncHandler(async (req, res, next) => {

  const waiting = await fetch('https://newsapi.org/v2/top-headlines?apiKey=b2fc7c882d564bafaff3a6eda736de97&language=en&category=business&country=us')
  const news = await waiting.json()
  res.json(news)
}))

module.exports = router;
