const express = require('express');
const asyncHandler = require('express-async-handler');
const {validationResult} = require('express-validator');

const Trades = require('../utils/trade-functions');

const { authenticated } = require('../utils/utils');
const { tradeValidation } = require('./validators/trade-middleware')

const router = express.Router();

router.post('/:security/buy', authenticated, tradeValidation, asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return next({ status: 422, errors: errors.array() })
  }

  try {
    const details = {...req.body}
    const trade = await Trades.buy(details, req.user.id, req.params.security)
    if(trade.error || !trade){
      throw error()
    }
    res.json({message: 'trade complete'})
  } catch (error) {
    next({status: 422, errors: 'Trade Failed'});
  }
}))

router.post('/:security/sell', authenticated, tradeValidation, asyncHandler(async (req,res,next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return next({ status: 422, errors: errors.array() })
  };

  try {
    const details = {...req.body}
    const trade = await Trades.sell(details, req.user.id, req.params.security)
    if(trade.error || !trade){
      throw error()
    }

    res.json({message: 'trade complete!'})

  } catch (error) {
    next({status: 422, errors: 'trade failed'});
  }
}))

router.post('/cash', authenticated, asyncHandler(async(req,res,next) => {
  const trade = await Trades.addCash(id);

  res.json({message: 'Cash was added to the account'});
}))
module.exports = router;
