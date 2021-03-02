'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Watchlists', {
      tickerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Tickers'
        },
        unique: 'watchlistCombination'
      },
      listId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Lists'
        },
        unique: 'watchlistCombination'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Watchlists');
  }
};
