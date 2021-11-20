const cors = require('cors');
const createError = require('http-errors')
const express = require('express');
const path = require('path');
const logger = require('morgan');
const helmet = require('helmet')
const routes = require('./routes');
const cron = require('node-cron')
const { config } = require('../api/config')
const { retrieveEODAssetPrices, updatePortfolioValuesDB } = require('./database_utils/utils');
const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'development' ? '*' : 'https://xtx-test-exchange.netlify.app'
}));
app.use(helmet({ hsts: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

app.use((req, res, next) => {
  next(createError(404));
});

cron.schedule('* 30 6 * * 1-5', async () => {
  await retrieveEODAssetPrices()
  await updatePortfolioValuesDB()
}, {
  timezone: "America/New_York"
})

app.use((err, req, res, next) => {

  res.status(err.status || 500);

  if (err.status === 401) {
    res.set('WWW-Authenticate', 'Bearer')
  }

  res.json({message: err.message})
})

module.exports = app;
