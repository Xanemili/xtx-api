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
    // NOTE: req.user.id is attached to the request body by the 'authenticated' middleware.
    const [results, metadata ] = await sequelize.query(`
      select t1."updatedAt", t1."tradeTotal", "Symbols"."symbol", "t1"."userId"
      from "Ledger" t1
      inner join
      (
        select date("updatedAt") as trade_date, max("updatedAt") as max_trade_time
        FROM "Ledger"
        group by date("updatedAt"), "Ledger"."userId"
      ) t2
        ON t2.trade_date = date(t1."updatedAt") and
          t2.max_trade_time = t1."updatedAt"
      inner join "Symbols"
      on "t1"."symbolId" = "Symbols"."id"
      where "t1"."userId" = ${req.user.id} and "Symbols"."symbol" = 'PORTVAL'
      order by
        t1."updatedAt"
    `)
    if (results) {
      res.json(results)
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
      phone = user.phone,
      zipcode = user.zipcode
    } = req.body

    console.log(zipcode)

    user.set({
      email,
      username,
      firstName,
      lastName,
      address,
      phone,
      zipcode,
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

router.post('/cash', authenticated, asyncHandler(async (req, res, next) => {
  try {
    const positions = await Position.findAll({
      where: {userId: req.user.id},
      include: {
        model: _Symbol,
        attributes: ['closePrice', 'name'],
      }
    })

    let curr_balance = 0
    let cash_id= 2
    let cash_idx = -1
    const result = await sequelize.transaction(async (t) => {

      positions.forEach( async (pos, idx) => {
        curr_balance = pos.quantity * pos._Symbol.closePrice

        if(pos._Symbol.name === 'CASH') {
          cash_id = pos.symbolId
          cash_idx = idx
          pos.quantity = pos.quantity + 1000
          await pos.update({ quantity: pos.quantity + 1000 }, {transaction: t})
        }
      })

      const curr = await Ledger.create({
        symbolId: cash_id,
        price: 1,
        quantity: 1000,
        tradeTotal: 1000,
        isOpen: true,
        balance: curr_balance
      }, {transaction: t })

      return positions[cash_idx]
    })

    res.json(result)

  } catch (e) {
    next(e)
  }
}))

module.exports = router;
