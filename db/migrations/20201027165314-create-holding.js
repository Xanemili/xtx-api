'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Holdings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users'
        }
      },
      tickerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Tickers'
        }
      },
      type: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'CASH'
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      positionCost: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0,
      },
      positionValue: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date ()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date ()
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Holdings');
  }
};
