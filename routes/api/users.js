const express = require('express');
const asyncHandler = require('express-async-handler');
const {validationResult } = require('express-validator')
const UserRepo = require('../../db/user-functions')
const {userAuth, userCreateAuth} = require('./user-auth-middleware')

const { authenticated, generateToken } = require('./utils');

const router = express.Router();

  router.post('/', userAuth, userCreateAuth, asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return next({ status: 422, errors: errors.array() });
    }

    try {
      const user = await UserRepo.create(req.body);
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

  module.exports = router;
