const express = require('express');
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator')
const { Op, fn, col } = require('sequelize')

const { List, _Symbol, Position, sequelize, User } = require('../../db/models')
const UserFuncs = require('../utils/user-functions')
const { userAuth, userCreateAuth } = require('./validators/user-auth-middleware')

const { authenticated, generateToken } = require('../utils/utils');
const { Ledger } = require('../../db/models/');

const router = express.Router();

router.post('/new', userAuth, userCreateAuth, asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next({ status: 422, errors: errors.array() });
  }

  console.log('here')
  try {

    await sequelize.transaction(async (t) => {

    const user = await UserFuncs.create(req.body);
    const { jwtid, token, expiration } = generateToken(user);
    user.tokenId = jwtid;
    await user.save();

    await List.create({
      userId: user.id,
      name: 'Watchlist',
      description: 'Stocks to Watch.',
    }, { transaction: t })

    const cashSymbol = await _Symbol.findOne({
      where: {
        symbol: 'CASH'
      }
    })

    await Position.create({
      userId: user.id,
      wavg_cost: 1,
      quantity: 0.00,
      symbolId: cashSymbol.id,
    }, { transaction: t })

    res.json({ token, user: user.toSafeObject(), expiration });
    })
  } catch (e) {
    next(e);
  }
}));

router.get('/portfolio', authenticated, async (req, res, next) => {
  console.log(req.user)
  try {
    const assets = await Ledger.findAll({
      where: {
        userId: req.user.id,
        [Op.or]: [{ isOpen: true }]
      },
      attributes: [[fn('sum', col('tradeTotal')), 'total'], [fn('sum', col('amount')), 'amount']],
      include: {
        model: _Symbol,
        attributes: ['symbol']
      },
      group: ['Symbol.id']
    });

    if (assets) {
      res.json(assets)
    };
  } catch (e) {
    console.error(e)
    next(e)
  }
});

router.get('/portfolio/history', authenticated, async (req, res, next) => {

  try {
    const portfolio = await Ledger.findAll({
      include: [{
        model: _Symbol,
        where: {
          symbol: 'PORT_VAL'
        },
        attributes: []
      }],
      where: {
        userId: req.user.id
      },
      attributes: ['id','updatedAt','price', 'tradeTotal']
    })

    if (portfolio) {
      res.json(
        portfolio
      )
    }
  } catch (e) {
    console.error(e)
    next(e)
  }
})

router.get('/', authenticated, (req, res) => {
  res.json({
    email: req.user.email,
    username: req.user.username,
  })
})

router.get('/cash', authenticated, asyncHandler(async (req, res, next) => {

  // I BROKE THIS!!!!!s

  const cash = await Position.findOne({
    where: { userId: req.user.id, isOpen: true, symbolId },
  });

  if (cash) {
    res.json(
      cash
    )
  } else {
    next('err');
  }

}))

module.exports = router;
