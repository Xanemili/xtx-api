'use strict';
module.exports = (sequelize, DataTypes) => {
  const Ledger = sequelize.define('Ledger', {
    userId: DataTypes.INTEGER,
    symbolId: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    quantity: DataTypes.INTEGER,
    balance: DataTypes.FLOAT,
    tradeTotal: DataTypes.FLOAT,
    isOpen: DataTypes.BOOLEAN,
    updatedAt: DataTypes.DATE,
  }, {freezeTableName: true});
  Ledger.associate = function(models) {
    Ledger.belongsTo(models.User, {foreignKey: 'userId'})
    Ledger.belongsTo(models._Symbol, {foreignKey: 'symbolId'})
  };
  return Ledger;
};
