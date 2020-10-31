'use strict';
module.exports = (sequelize, DataTypes) => {
  const Ticker = sequelize.define('Ticker', {
    ticker: DataTypes.STRING,
    name: DataTypes.STRING,
    market: DataTypes.STRING,
    url: DataTypes.STRING

  }, {});
  Ticker.associate = function(models) {
    Ticker.hasMany(models.Ledger, {foreignKey: 'tickerId'})
    Ticker.hasMany(models.Holding, {foreignKey: 'tickerId'})
    Ticker.belongsToMany(models.List, {through: 'Watchlist', foreignKey: 'tickerId'})
  };
  return Ticker;
};
