'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint('List_Symbols', ['symbolId', 'listId'], {
        type: 'primary key',
        name: 'pk_list_symbol'
      },)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint('List_Symbols', 'pk_list_symbol')
  }
}
