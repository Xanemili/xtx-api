'use strict';
module.exports = (sequelize, DataTypes) => {
  const List = sequelize.define('List', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  List.associate = function(models) {
    List.belongsToMany(models.Ticker, {through: 'Watchlist', foreignKey: 'listId'});
    List.belongsTo(models.User, {foreignKey: 'userId'});
  };
  return List;
};
