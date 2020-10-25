'use strict';

const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    name: DataTypes.STRING,
    hashedPassword: DataTypes.STRING,
    tokenId: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };

  User.prototype.setPassword = function (password) {
    this.hashedPassword = bcrypt.hashSync(password);
    return this;
  };

  User.prototype.isValidPassowrd = function (password) {
    return bcrypt.compareSync(password, this.hashedPassword.toString());
  };

  return User;

};
