'use strict';
const bcrypt = require('bcryptjs');

function createPassword() {
  return bcrypt.hashSync('password22');
}

module.exports = {
  up: (queryInterface, Sequelize) => {

    return queryInterface.bulkInsert('Users', [
      {name: 'Demo', email: 'demo@example.com', hashedPassword: createPassword()},
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users');
  }
};
