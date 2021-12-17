'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeConstraint('List_Symbols', 'Watchlists_listId_fkey', {transaction: t}),
        queryInterface.addConstraint('List_Symbols',
         {fields: ['listId'],
         type: 'foreign key',
         name: 'Watchlists_listId_fkey',
         references: {table: 'Lists', field: 'id',  },
         onDelete: 'cascade',
         transaction: t
        })
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
     return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeConstraint('List_Symbols', 'Watchlists_listId_fkey', {transaction: t}),
        queryInterface.addConstraint('List_Symbols',
          {
            fields: ['listId'],
            type: 'foreign key',
            name: 'Watchlists_listId_fkey',
            references: {table: 'Lists', field: 'id',  },
            transaction: t
          })
      ])
    })
  }
}
