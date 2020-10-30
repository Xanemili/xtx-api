const express = require('express');
const asyncHandler = require('express-async-handler');
const {validationResult} = require('express-validator');
const { authenticated } = require('../utils/utils');
const alpha = require('alphavantage')({
   key: '1VQHQEGV3T5XK5SX'
 });

const router = express.Router()

router.get('/:asset', authenticated, asyncHandler( async(req,res,next) => {
  const data = await alpha.data.daily(req.params.asset)

  if(data){
    res.json({data})
  } else {
    const err = Error('Security is not supported')
    err.errors = ['security is not supported']
    next (err)
  }

}))

module.exports = router;
