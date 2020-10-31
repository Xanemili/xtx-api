'use strict';
const bcrypt = require('bcryptjs');

function createPassword() {
  return bcrypt.hashSync('password22');
}

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('Users', [
      {
        username: 'Demo User',
        email: 'demo@example.com',
        hashedPassword: createPassword(),
        firstName:'Demo',
        lastName: 'Hood',
        phone: '1110001111',
        address: '111 Test Dr, Seattle Washington 11111'},
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users');
  }
};
