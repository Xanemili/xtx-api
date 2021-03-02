const express = require('express');
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator')
const { Op, fn, col } = require('sequelize')

const { List, Ticker, User, sequelize } = require('../../db/models')
const UserFuncs = require('../utils/user-functions')
const { userAuth, userCreateAuth } = require('./validators/user-auth-middleware')

const { authenticated, generateToken } = require('../utils/utils');
const { Ledger } = require('../../db/models/');

const router = express.Router();

router.post('/', userAuth, userCreateAuth, asyncHandler(async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next({ status: 422, errors: errors.array() });
  }

  try {
    const user = await UserFuncs.create(req.body);
    const { jwtid, token } = generateToken(user);
    user.tokenId = jwtid;
    await user.save();

    await Ledger.create({
      userId: user.id,
      tickerId: 1,
      price: 1,
      amount: 1000,
      tradeTotal: 1000,
      isOpen: false,
    })

    await List.create({
      userId: user.id,
      name: 'Watchlist',
      description: 'Stocks to Watch.',
    })

    res.json({ token, user: user.toSafeObject() });
  } catch (e) {
    next(e);
  }
}));

router.get('/portfolio', authenticated, async (req, res, next) => {
  try {
    const portfolio = await Ledger.findAll({
      where: {
        userId: req.user.id,
        [Op.or]: [{ isOpen: true }]
      },
      attributes: [[fn('sum', col('tradeTotal')), 'total'], [fn('sum', col('amount')), 'amount']],
      include: {
        model: Ticker,
        attributes: ['ticker']
      },
      group: ['Ticker.id']
    });

    if (portfolio) {
      res.json({
        portfolio
      })
    };
  } catch (e) {
    next(e)
  }


});

router.get('/portfolio/history', authenticated, async (req, res, next) => {

  // this currently on includes trades on the date they were made.... need to fix.
  try {
    let portfolio = await Ledger.findAll({
      where: {
        [Op.and]: [
          { userId: req.user.id },
          { isOpen: true }
        ]
      },
      attributes: [[fn('sum', col('tradeTotal')), 'total'], [fn('DATE_TRUNC', 'day', sequelize.col('createdAt')), 'date']],
      group: ['date']
    });

    if (portfolio) {
      res.json({
        portfolio
      })
    }
  } catch (e) {
    next('err')
  }
})

router.get('/', authenticated, (req, res) => {
  res.json({
    email: req.user.email,
    username: req.user.username,
  })
})

router.get('/cash', authenticated, asyncHandler(async (req, res, next) => {
  const cash = await Ledger.findAll({
    where: { userId: req.user.id, isOpen: true, tickerId: 1 },
    attributes: [[fn('sum', col('tradeTotal')), 'total'], [fn('sum', col('amount')), 'amount']],
  });

  if (cash) {
    res.json(
      cash
    )
  } else {
    next('err');
  }

}))

// test for portfolio valuation
// router.get('/testing_portfolio', asyncHandler(async (req, res, next) => {
//   try {

//     const users = await User.findAll({
//       include: [
//         {
//           model: Ledger,
//           where: {
//             isOpen: true
//           },
//           include: [{
//             model: Ticker,
//             attributes: ['id', 'ticker', 'closePrice']
//         }],
//       }],
//       attributes: ['username', 'id'],
//       //tried to simplfy it with sql. failed. going to easy but inefficient mode for now.
//       // attributes: {
//       //   include: [
//       //     sequelize.literal(`(
//       //       SELECT SUM("Ledger".amount) AS total
//       //       FROM "Ledger"
//       //       WHERE "Ledger"."userId" = id
//       //       GROUP BY "Ledger"."tickerId"
//       //     )`)
//       //   ]
//       // },
//     })
//     console.log(users)
//     for(let i = 0; i<users.length; i++){
//       let total = 0
//       let cost = 0
//       for( let j = 0; j< users[i].Ledgers.length; j++){
//         total = total + (users[i].Ledgers[j].amount * users[i].Ledgers[j].Ticker.closePrice)
//         cost = cost + (users[i].Ledgers[j].tradeTotal)
//       }
//       let port = await Ledger.create({
//         userId: users[i].id,
//         tickerId: 2,
//         tradeTotal: total,
//         isOpen: false,
//         amount: total,
//         price: cost
//       })
//       console.log(total, cost)
//       console.log(port)
//     }
    
//     res.json(users)
//   } catch (e) {
//     console.log(e)
//     next(e)
//   }

// }))

module.exports = router;
