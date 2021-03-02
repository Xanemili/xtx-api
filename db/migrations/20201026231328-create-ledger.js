'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Ledger', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users'
        }
      },
      tickerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Tickers'
        }
      },
      price: {
        type: Sequelize.FLOAT(2),
        allowNull: false
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      tradeTotal: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      isOpen: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date ()
      }
    },{
      paranoid: true
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Ledger');
  }
};
