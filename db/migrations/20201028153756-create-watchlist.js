'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Watchlists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tickerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Tickers'
        }
      },
      listId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Lists'
        }
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
