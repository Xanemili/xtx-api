const express = require('express');
const asyncHandler = require('express-async-handler');
const {validationResult} = require('express-validator');
const Trades = require('../utils/trade-functions');
const { authenticated } = require('../utils/utils');
const { tradeValidation } = require('./validators/trade-middleware')
const { checkSymbol } = require('./validators/checkSymbol')
const { _Symbol } = require('../../db/models')


const router = express.Router();

router.post('/buy', authenticated, tradeValidation, asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);

  let symbol = await _Symbol.findOne({
    where: { symbol: req.body.symbol }
  });


  if (!symbol) {
    const iex_symbol =  await checkSymbol(req.body.symbol);

    if (!iex_symbol) {
      return next({status: 422, errors: 'Symbol is not supported.'})
    }

    symbol = await _Symbol.create({
      symbol: iex_symbol.symbol,
      latestUpdate: iex_symbol.latestUpdate,
      openPrice: iex_symbol.open,
      closePrice: iex_symbol.close,
      name: iex_symbol.companyName,
    })
  }

  console.log(errors)
  if(!errors.isEmpty()) {
    return next({ status: 422, errors: errors.array() })
  }

  try {
    const details = {...req.body}
    const trade = await Trades.buy(details, req.user.id, symbol)
    res.json(trade)
  } catch (error) {
    console.log(error)
    next(error);
  }
}))

router.post('/:security/SELL', authenticated, tradeValidation, asyncHandler(async (req,res,next) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()) {
    return next({ status: 422, errors: errors.array() })
  };

  try {
    const details = {...req.body}
    const trade = await Trades.sell(details, req.user.id, req.params.security)
    if(trade.error || !trade){
      console.log(trade.error)
      throw new Error(trade.error.message)
    }

    res.json({message: 'trade complete!'})

  } catch (error) {
    next({status: 422, errors: 'trade failed'});
  }
}))

router.post('/cash', authenticated, asyncHandler(async(req,res,next) => {
  const trade = await Trades.addCash(req.user.id);
  console.log(trade)
  if(trade){
    res.json(trade);
  } else {
    next({status: 422, errors: 'Cash was unable to be processed.'})
  }
}))
module.exports = router;
