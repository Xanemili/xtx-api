'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
     return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.renameTable('Users_Lists', 'List_Symbols', {transaction: t}),
      ])})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.renameTable('List_Symbols','Users_Lists', {transaction: t}),
      ])})
  }
};
