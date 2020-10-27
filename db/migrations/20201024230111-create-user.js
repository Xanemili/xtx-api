'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(255),
      },
      username: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(50),
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      lastName: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      address: {
        allowNull: false,
        type: Sequelize.STRING(100)
      },
      phone: {
        allowNull: false,
        type: Sequelize.STRING(10),
      },
      hashedPassword: {
        allowNull: false,
        type: Sequelize.STRING(60).BINARY
      },
      tokenId: {
        type: Sequelize.STRING(36)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date(),
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
