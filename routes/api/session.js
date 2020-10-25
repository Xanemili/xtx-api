const express = require('express');
const asyncHandler = require('express-async-handler');
const { check, validationResult } = require('express-validator');

const { authenticated, generateToken } = require('./utils');

const router = express.Router();

const email = check('email')
  .isEmail()
  .withMessage('Please provide a valid email address')
  .normalizeEmail();

  const password = check('password')
    .not().isEmpty()
    .withMessage('Please provide a password');

router.put('/', [email, password], asyncHandler(async (req, res, next) => {
  const errors = validationResults(req);
  if (!errors.isEmpty()) {
    return next({ status: 422, errors: errors.array() });
  }

  const { email, password } = req.body;
  const user = await User;
  if(!user.isValidPassword(password)) {
    const err = new Error('Login failed');
    err.status = 401;
    err.title = 'Login failed';
    err.errors = ['Invalid Credentials'];
    return next(err);
  }
  const { jwtid, token } = generateToken(user);
  user.tokenId = jwtid;
  await user.save();
  res.json({ token, player: player.toSafeObject() })
}))

router.delete('/', [authenticated], asyncHandler(async (req,res ) => {
  res.user.tokenId = null;
  await req.user.save();
  res.json({ message: 'success' })
}));

module.exports = router;