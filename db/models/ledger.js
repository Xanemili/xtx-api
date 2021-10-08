'use strict';
module.exports = (sequelize, DataTypes) => {
  const Ledger = sequelize.define('Ledger', {
    userId: DataTypes.INTEGER,
    tickerId: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    amount: DataTypes.INTEGER,
    tradeTotal: DataTypes.FLOAT,
    isOpen: DataTypes.BOOLEAN,
  }, {freezeTableName: true});
  Ledger.associate = function(models) {
    Ledger.belongsTo(models.User, {foreignKey: 'userId'})
    Ledger.belongsTo(models.Ticker, {foreignKey: 'tickerId'})
  };
  return Ledger;
};
