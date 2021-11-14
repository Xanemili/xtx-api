'use strict';
const {User, _Symbol} = require('../models')

module.exports = {
  up: async (queryInterface, Sequelize) => {

    let user = await User.findOne({
      where: {username: 'Demo User'}
    })

    return queryInterface.bulkInsert('Lists', [
      {name: 'Watch List', description: "Stocks I am watching", userId: user.id, createdAt: new Date(), updatedAt: new Date()},
      {name: 'Second Watch List', description: "This is a second watchlist", userId: user.id, createdAt: new Date(), updatedAt: new Date()}
    ], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Lists')
  }
};
