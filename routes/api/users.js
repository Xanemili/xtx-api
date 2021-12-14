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

  try {
    const assets = await Position.findAll( {
      where: { userId: req.user.id },
      include: { model: _Symbol, required: true, attributes: [] },
      attributes: [
        'id', 'updatedAt', 'quantity', 'wavg_cost', 'symbolId',
        [sequelize.col('_Symbol.symbol'), 'symbol'],
    ]
    })

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
          symbol: 'PORTVAL'
        },
        attributes: []
      }],
      where: {
        userId: req.user.id
      },
      attributes: {
        include: [
          'id','updatedAt','price', 'tradeTotal'
        ]
      },
      group: ['Ledger.updatedAt', 'Ledger.id']
    })
    if (portfolio) {
      res.json(portfolio)
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

router.get('/profile', authenticated, asyncHandler(async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: ['email', 'username', 'firstName', 'lastName', 'address', 'phone']
    },)

    if(user) {
      res.json(user)
    } else {
      throw Error('No User found.')
    }
  } catch(err) {
    next(err)
  }
}))

router.put('/profile', authenticated, asyncHandler(async (req,res,next) => {

  try {
    const user = await User.findOne({
      where: { id: req.user.id },
      attributes: [ 'id', 'email', 'username', 'firstName', 'lastName', 'address', 'phone']
    })

    const {
      email = user.email,
      username = user.username,
      firstName = user.firstName,
      lastName = user.lastName,
      address = user.address,
      phone = user.phone
    } = req.body

    user.set({
      email,
      username,
      firstName,
      lastName,
      address,
      phone,
    })

    await user.save()
    res.json(user)

  } catch(err) {
    next(err)
  }

}))

router.get('/cash', authenticated, asyncHandler(async (req, res, next) => {

  try {
    const cash = await Position.findOne({
      where: { userId: req.user.id },
      include: {
        model: _Symbol,
        where: { symbol: 'CASH' },
        attributes: [],
      },
      attributes: ['quantity', 'symbolId', 'updatedAt']
    });

    if (cash) {
      res.json(cash)
    } else {
      const err = new Error('Error retrieving cash.')
      throw err
    }
  } catch(e) {
    next(e)
  }

}))

module.exports = router;
