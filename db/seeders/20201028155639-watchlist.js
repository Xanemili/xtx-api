'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.bulkInsert('Watchlists', [
        {id: 1, tickerId: 2, listId: 1},
        {id: 2, tickerId: 3, listId: 1},
        {id: 3, tickerId: 2, listId: 2}
      ], {});

  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Watchlists', null, {});
  }
};
