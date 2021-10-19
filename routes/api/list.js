const express = require('express');
const asyncHandler = require('express-async-handler');
const {
  body,
  validationResult
} = require('express-validator')

const {
  List,
  Ticker,
} = require('../../db/models');
const {
  authenticated
} = require('../utils/utils');
const { checkTicker } = require('./validators/checkTicker');

const router = express.Router();

const listValidators = [
  body('name').not().isEmpty().withMessage('Please provide a name for the List.')
]

router.get('/', authenticated, asyncHandler(async (req, res, next) => {

  console.log(req.user.id)

  try {
    const lists = await List.findAll({
      where: {
        userId: req.user.id
      },
      include: {
        model: Ticker,
        required: false,
        attributes: ['ticker'],
        through: {
          attributes: [] //specifies no loading of junction table.
        }
      },
      attributes: ['name', 'description', 'id'],
    })

    res.json(lists)
  } catch(e) {
    next(e)
  }
}));

router.post('/new', authenticated, listValidators, asyncHandler(async (req, res, next) => {

  console.log(req.body)
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next({
      status: 422,
      errors: errors.array()
    })
  }

  const newList = await List.create({
    name: req.body.name,
    description: req.body.description,
    userId: req.user.id,
  })

  if (!newList) {
    throw new Error()
  }

  res.json(newList);
}))

router.delete('/:listId', authenticated, asyncHandler(async (req, res, next) => {

  try {
    const listToDelete = await List.findOne({
      where: {
        id: req.params.listId
      }
    });

    if (listToDelete) {
      await listToDelete.destroy();
      res.json()
    }
  } catch(e) {
    next(e)
  }
}))

router.put('/:listId/security/:id', asyncHandler(async (req, res, next) => {

  let ticker = await Ticker.findOne({
    where: {
      ticker: req.body.ticker
    }
  });

  if(!ticker) {
    try {
      iex_ticker = await checkTicker(req.body.ticker)

      ticker = await Ticker.create({
        ticker: iex_ticker.iex_ticker,
      })

    } catch (e) {
      console.log(e)
      next(e)
    }
  }

  const list = await List.findOne({
    where: {
      id: req.params.listId
    },
  })

  try {
    await list.addTicker(ticker)
    res.json(ticker)
  } catch(e) {
    next(e)
  }

}))

router.delete('/:listId/security/:id', asyncHandler(async (req, res, next) => {

  const ticker = await Ticker.findByPk(id);

  if(!ticker) {
    const err = Error('Security was not found.')
    err.errors = ['Security was not found.']
    err.title = 'Security not found.'
    err.status = 404
    next(err)
  }

  const list = await List.findOne({
    where: {
      id: req.params.listId
    }
  })

  try {
    await list.removeTicker(ticker)
  } catch (e) {
    const err = Error('Security was not a member of the list.');
    err.errors = ['Security was not a member of the list.'];
    err.title = 'Security not found.';
    err.status = 422;
    next(err)
  }

  res.json(`${ticker.ticker} was removed from your list`)
}));

module.exports = router;
