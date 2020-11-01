const {check} = require('express-validator');

const email = check('email')
  .isEmail()
  .withMessage('Please provide a valid email address')
  // .custom( value => {
  //   return User.findUserByEmail(value).then( user => {
  //     if(user) {
  //       return Promise.reject('This E-mail already exists.')
  //     } else{
  //       Promise.resolve();
  //     }
  //   })
  // })
  .normalizeEmail();

const username = check('username')
  .not().isEmpty()
  .withMessage('Please provide a user name');

const password = check('password')
  .not().isEmpty()
  .withMessage('Please provide a password');

const address = check('address')
  .not().isEmpty()
  .withMessage('Please provide an Address');

const phone = check('phone')
  .not().isEmpty()
  .withMessage('Please provide a phone number');

const firstName = check('firstName')
  .not().isEmpty()
  .withMessage('Please provide a First Name');

const lastName = check('lastName')
  .not().isEmpty()
  .withMessage('Please provide a lastName')

const userAuth = [email, username, password]
const userCreateAuth = [address, phone, firstName, lastName]

module.exports = {
  userAuth,
  userCreateAuth
}
