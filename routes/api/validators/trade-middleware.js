const {check} = require('express-validator');

const orderType = check('orderType')
  .not().isEmpty()
  .withMessage('A trade must have a order type')
  .isIn(['BUY','SELL'])
  .withMessage('You must place a valid order type')

const price = check('price')
  .not().isEmpty()
  .withMessage('Prices must not be null')

const amount = check('amount')
  .not().isEmpty()
  .withMessage('Trades must have a valid amount')
  .isInt()
  .withMessage('Amounts must be integers')

tradeValidation = [orderType, price, amount]

module.exports = {
  tradeValidation
}
