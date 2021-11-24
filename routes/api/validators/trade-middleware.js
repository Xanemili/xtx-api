const {check} = require('express-validator');

const orderType = check('orderType')
  .not().isEmpty()
  .withMessage('A trade must have a order type')
  .isIn(['buy','sell'])
  .withMessage('You must place a valid order type')

const price = check('price')
  .not().isEmpty()
  .withMessage('Prices must not be null')

const quantity = check('quantity')
  .not().isEmpty()
  .withMessage('Trades must have a valid quantity')
  .isInt()
  .withMessage('Quantity must be an integer')

tradeValidation = [orderType, price, quantity]

module.exports = {
  tradeValidation
}
