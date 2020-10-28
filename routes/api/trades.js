const express = require('express');
const asyncHandler = require('express-async-handler');
const {validationResult} = require('express-validator');

const Trades = require('../utils/trade-functions');

const { authenticated } = require('../utils/utils');
const { tradeValidation } = require('./trade-middleware')

const router = express.Router();

//DONT FORGET TO REIMPLEMENT TOKEN VALIDATION MIDDLEWARE

router.post('/buy', tradeValidation, asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return next({ status: 422, errors: errors.array() })
  }

  // need conditional logic for buying and selling

  try {
    const details = {...req.body}
    const trade = await Trades.buy(details)
    if(trade.error || !trade){
      throw error()
    }
    res.json({message: 'trade complete'})
  } catch (error) {
    next({status: 422, errors: 'Trade Failed'});
  }
}))

router.post('/sell', tradeValidation, asyncHandler(async (req,res,next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return next({ status: 422, errors: errors.array() })
  };

  try {

  } catch (error) {
    next({status: 422, errors: 'trade failed'});
  }
}))

module.exports = router;
