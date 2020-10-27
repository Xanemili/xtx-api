const {check} = require('express-validator');

const orderType = check('orderType')
  .not().isEmpty()
  .withMessage('A trade must have a order type')
  .isIn(['buy','sell'])
  .withMessage('You must place a valid order type')

const ticker = check('ticker')
  .not().isEmpty()
  .withMessage('Trades must done upon supported tickers')

const price = check('price')
  .not().isEmpty()
  .withMessage('Prices must not be null')

const amount = check('amount')
  .not().isEmpty()
  .withMessage('Trades must have a valid amount')
  .isInt()
  .withMessage('Amounts must be integers')

tradeValidation = [orderType, ticker, price, amount]

module.exports = {
  tradeValidation
}
