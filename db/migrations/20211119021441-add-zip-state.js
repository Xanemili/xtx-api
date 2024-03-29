'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('Users', 'zipcode', {
            type: Sequelize.STRING,
          }, {transaction: t}),
          queryInterface.addColumn('Users', 'state', {
            type: Sequelize.STRING,
          }, {transaction: t })
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction( t => {
      return Promise.all([
        queryInterface.removeColumn('Users', 'zipcode', { transaction: t }),
        queryInterface.removeColumn('Users', 'state', { transaction: t })
      ])
    })
  }
}
