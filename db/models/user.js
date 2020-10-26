'use strict';

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validates: {
        isEmail: true,
        len: [5, 255]
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validates: {
        len: [3, 255],
      }
    },
    hashedPassword: {
      type: DataTypes.STRING.BINARY,
      allowNull: false,
      validates: {
        len: [60, 60],
      }
    },
      tokenId: {
        type: DataTypes.STRING
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
      createdAt: this.createdAt,
      email: this.email,
      id: this.id,
      name: this.name,
      updatedAt: this.updatedAt,
    };
  }

  return User;
};
