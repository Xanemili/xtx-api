'use strict';
module.exports = (sequelize, DataTypes) => {
  const Watchlist = sequelize.define('Watchlist', {
    tickerId: DataTypes.INTEGER,
    listId: DataTypes.INTEGER
  }, {});
  Watchlist.associate = function(models) {
    Watchlist.belongsTo(models.List, {foreignKey: 'listId'});
    Watchlist.belongsTo(models.Ticker, {foreignKey: 'tickerId'});
  };
  return Watchlist;
};
