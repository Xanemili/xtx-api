const {check} = require('express-validator');
const {User} = require('../../../db/models')

const email = check('email')
  .isEmail()
  .withMessage('Please provide a valid email address')
  .normalizeEmail()
  .custom( value => {
    return User.findOne({ where: {email: value}}).then(user => {
      if (user) {
        return Promise.reject('E-mail already in use.')
      }
    })
  });

const username = check('username')
  .not().isEmpty()
  .trim().escape()
  .withMessage('Please provide a user name');

const password = check('password')
  .not().isEmpty()
  .withMessage('Please provide a password');

const address = check('address')
  .not().isEmpty()
  .trim().escape()
  .withMessage('Please provide an Address');

const state = check('state')
  .not().isEmpty()
  .trim().escape()
  .withMessage('Please provide a valid State')

const phone = check('phone')
  .not().isEmpty()
  .isLength({min: 5})
  .withMessage('Please provide a phone number');

const firstName = check('firstName')
  .not().isEmpty()
  .withMessage('Please provide a First Name');

const lastName = check('lastName')
  .not().isEmpty()
  .withMessage('Please provide a lastName')

const userAuth = [ email, username, password ]
const userCreateAuth = [ address, phone, firstName, lastName ]
const editUserAuth = [ email, username, phone, firstName, lastName, address ]

module.exports = {
  userAuth,
  userCreateAuth,
  editUserAuth,
}
