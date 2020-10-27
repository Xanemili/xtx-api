'use strict';

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validates: {
        isEmail: true,
        len: [5, 255]
      }
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validates: {
        len: [3, 255],
      }
    },
    firstName: {
      allowNull: false,
      type: DataTypes.STRING(50),
      isAlpha: true
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING(50),
      isAlpha: true
    },
    address: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    phone: {
      allownull: false,
      type: DataTypes.STRING(10)
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validates: {
        len: [60, 60],
      }
    },
      tokenId: {
        type: DataTypes.STRING,
        allowNull: true
      }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };

  User.prototype.isValid = () => true;

  User.prototype.setPassword = function (password) {
    this.hashedPassword = bcrypt.hashSync(password);
    return this;
  };

  User.prototype.isValidPassword = function (password) {
    return bcrypt.compareSync(password, this.hashedPassword.toString());
  };

  User.prototype.toSafeObject = function () {
    return {
      email: this.email,
      id: this.id,
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName,
      address: this.address,
      phone: this.phone,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  return User;
};
