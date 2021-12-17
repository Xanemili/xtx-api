const express = require('express');
const asyncHandler = require('express-async-handler');
const {
  body,
  validationResult
} = require('express-validator')

const {
  List,
  _Symbol,
  ListSymbol
} = require('../../db/models');
const {
  authenticated
} = require('../utils/utils');
const { checkSymbol } = require('./validators/checkSymbol');

const router = express.Router();

const listValidators = [
  body('name').not().isEmpty().withMessage('Please provide a name for the List.')
]

router.get('/', authenticated, asyncHandler(async (req, res, next) => {

  try {
    const lists = await List.findAll({
      where: {
        userId: req.user.id
      },
      include: {
        model: _Symbol,
        as: 'symbols',
        required: false,
        attributes: ['symbol', 'id'],
        through: {
          attributes: [] //specifies no loading of junction table.
        }
      },
      attributes: ['name', 'description', 'id'],
    })


    let listObj = {}
    for (let list of lists) {
      listObj[list.id] = list
    }

    res.json(listObj)
  } catch(e) {
    next(e)
  }
}));

router.post('/new', authenticated, listValidators, asyncHandler(async (req, res, next) => {

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
      },
    });

    if (listToDelete) {
      await listToDelete.destroy( { truncate: true, cascade: true });
      res.json(listToDelete)
    }
  } catch(e) {
    next(e)
  }
}))

router.put('/:listId/:symbol', asyncHandler(async (req, res, next) => {

  let symbol = await _Symbol.findOne({
    where: {
      symbol: req.params.symbol
    }
  });

  if(!symbol) {
    try {
      iex_symbol = await checkSymbol(req.params.symbol)
      symbol = await _Symbol.create({
        symbol: iex_symbol.symbol,
      })
    } catch (e) {
      next(e)
    }
  }

  try {
    const list = await List.findOne({
      where: {
        id: req.params.listId
      },
      include: {
        model: _Symbol,
        as: 'symbols'
      }
    })

    await ListSymbol.create({
      symbolId: symbol.id,
      listId: list.id,
    })
    res.json(symbol)
  } catch(e) {
    console.log(e)
    next(e)
  }

}))

router.delete('/:listId/:symbol', asyncHandler(async (req, res, next) => {

  const symbol = await _Symbol.findOne({ where: { symbol: req.params.symbol }}
    );

  if(!symbol) {
    const err = Error('Security was not found.')
    err.errors = ['Security was not found.']
    err.title = 'Security not found.'
    err.status = 404
    next(err)
  }

  const list = await List.findByPk(req.params.listId)

  try {
    await list.removeSymbol(symbol)
  } catch (e) {
    next(err)
  }

  res.json({ id: list.id, symbol: symbol})
}));

module.exports = router;
