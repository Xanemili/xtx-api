const express = require('express');
const asyncHandler = require('express-async-handler');
const { check, validationResult } = require('express-validator')

const { authenticated, generateToken } = require('./utils');

const router = express.Router();

const email = check('email')
  .isEmail()
  .withMessage('Please provide a valid email address')
  .normalizeEmail();

  const name = check('name')
    .not().isEmpty()
    .withMessage('Please provide a user name');

  const password = check('password')
    .not().isEmpty()
    .withMessage('Please provide a password');

  const userAuth = [email, name, password]

  router.post('/', userAuth, asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return next({ status: 422, errors: errors.array() });
    }

    const user = await User // await user creation

    const { jwtid, token } = generateToken(user);
    user.tokenId = jwtid;
    await user.save();
    res.json({ token, player: player.toSafeObject() }) //need to create the user creation
  }));

  router.get('/user', authenticated, (req,res)=> {
    res.json({
      email: req.user.email,
      name: req.user.name,
    })
  })

  module.exports = router;