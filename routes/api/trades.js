const express = require('express');
const asyncHandler = require('express-async-handler');
const {validationResult} = require('express-validator');

const Trades = require('../../db/trade-functions');

const { authenticated } = require('./utils');
const { tradeValidation } = require('./trade-middleware')

const router = express.Router();

router.post('/', authenticated, tradeValidation, asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return next({ status: 422, errors: errors.array() })
  }

  // need conditional logic for buying and selling

  try {
    const details = {...req.body}
    const trade = await Trades.buy(details)
    console.log(trade)
    if(!trade){
      throw error()
    }
    res.json({message: 'trade complete'})
  } catch (error) {
    next({status: 422, errors: 'trade failed'});
  }
}))

module.exports = router;
