const express = require('express');
const asyncHandler = require('express-async-handler');
const {check, validationResult } = require('express-validator')

const {List, Ticker, Watchlist} = require('../../db/models');
const { authenticated} = require('../utils/utils');

const router = express.Router();

const listValidators = [
  check('name').not().isEmpty().withMessage('Please provide a name for the List.')
]

router.get('/', authenticated, asyncHandler( async (req,res,next)=> {

  const watchlist = await List.findOne({
    where: {userId: req.user.id},
    include: {
      model: Ticker,
      attributes: ['ticker'],
      required: false
      },
    attributes: ['name', 'description'],
  })

  if(watchlist) {
    res.json({watchlist})
  } else {
    const err = Error('No lists found.');
    err.errors = [`Lists were not found`];
    err.title = `No Lists`;
    err.status = 404;
    next(err);
  }
}));

router.post('/', authenticated, listValidators, asyncHandler( async(req, res, next) => {

  const errors = validationResult(req);

  if(!errors.isEmpty()){
    return next({status: 422, errors: errors.array() })
  }

  const newList = await List.create({
    name: req.body.name,
    description: req.body.description,
    userId: req.user.id,
  })

  if(!newList){
    throw new Error()
  }

  res.json({message: `${newList.name} was created!`});
}))

router.delete('/:listId', authenticated, asyncHandler( async (req, res, next) => {
  const listToDelete = await List.findOne({where: {id: req.params.listId}});

  if(listToDelete){
    await listToDelete.destroy();
    res.json({message: 'List was removed from your profile.'})
  }
}))

router.post('/security/:security', authenticated, asyncHandler( async (req,res,next) => {
  // crude implementation. only works with the one watchlist at the moment. Need to alter if adding multiple list features.
  let ticker = await Ticker.findOne({where: {
    ticker: req.params.security
  }});

  if (!ticker) {
    ticker = await Ticker.create({
      ticker: req.params.security,
    })
  }
  
  const list = await List.findOne({where: {
    userId: req.user.id
  }})

  const security = await Watchlist.create({
    tickerId: ticker.id,
    listId: list.id
  });

  if(security){
    res.json({security});
  } else {
    const err = Error('That security was not found.')
    next(err)
  }
}))

router.delete('/security/:security', authenticated, asyncHandler( async (req, res, next) => {

  const ticker = await Ticker.findOne({where: {
    ticker: req.params.security
  }});


  const securityToDelete = await Watchlist.findOne({
    where: {
      tickerId: ticker.id,
    }, include: {
      model: List,
      where: {
        userId: req.user.id
      }
    }
  });


  if(securityToDelete) {
    await securityToDelete.destroy();
    res.json({message: `${ticker.ticker} was removed from your list`})
  } else {
    const err = Error('Security was not a member of the list.');
    err.errors = ['Security was not a member of the list.'];
    err.title = 'Security not found.';
    err.status = 422;
    next(err)
  }
}));





module.exports = router;
