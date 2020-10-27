'use strict';
module.exports = (sequelize, DataTypes) => {
  const ledger = sequelize.define('Ledger', {
    userId: DataTypes.INTEGER,
    tickerId: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    amount: DataTypes.INTEGER
  }, {});
  ledger.associate = function(models) {
    // associations can be defined here
  };
  return ledger;
};
