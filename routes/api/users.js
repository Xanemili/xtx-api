const express = require('express');
const asyncHandler = require('express-async-handler');
const {validationResult } = require('express-validator')

const {Holding, Ticker} = require('../../db/models')
const UserFuncs = require('../utils/user-functions')
const {userAuth, userCreateAuth} = require('./validators/user-auth-middleware')

const { authenticated, generateToken } = require('../utils/utils');

const router = express.Router();

  router.post('/', userAuth, userCreateAuth, asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return next({ status: 422, errors: errors.array() });
    }

    try {
      const user = await UserFuncs.create(req.body);
      const { jwtid, token } = generateToken(user);
      user.tokenId = jwtid;
      await user.save();
      res.json({ token, user: user.toSafeObject() });
    } catch (e){
      next(e);
    }
  }));

  router.get('/', authenticated, (req,res)=> {
    res.json({
      email: req.user.email,
      username: req.user.username,
    })
  })

  router.get('/portfolio', authenticated, async(req, res, next) => {
    const portfolio = await Holding.findAll({
      where: { userId: req.user.id },
      attributes: ['amount','positionValue','positionCost'],
      include: {
        model: Ticker,
        attributes: ['ticker']
      }
    });

    if(portfolio){

      console.log(portfolio)
      res.json({
        portfolio
      })
    };

    next('err')
  })



  module.exports = router;
