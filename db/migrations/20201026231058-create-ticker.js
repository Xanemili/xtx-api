'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Tickers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ticker: {
        type: Sequelize.STRING(8),
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      market: {
        type: Sequelize.STRING(15),
        allowNull: false
      },
      url: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: ''
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
    return queryInterface.dropTable('Tickers');
  }
};
