'use strict';
module.exports = (sequelize, DataTypes) => {
  const Ticker = sequelize.define('Ticker', {
    ticker: DataTypes.STRING,
    EODPrice: DataTypes.FLOAT,
  }, {});
  Ticker.associate = function(models) {
    Ticker.hasMany(models.Ledger, {foreignKey: 'tickerId'})
    Ticker.hasMany(models.Holding, {foreignKey: 'tickerId'})
  };
  return Ticker;
};
