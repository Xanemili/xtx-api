'use strict';
module.exports = (sequelize, DataTypes) => {
  const Holding = sequelize.define('Holding', {
    userId: DataTypes.INTEGER,
    tickerId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    positionValue: DataTypes.FLOAT,
    positionCost: DataTypes.FLOAT
  }, {});
  Holding.associate = function(models) {
    Holding.belongsTo( models.User, {foreignKey: 'userId'})
    Holding.belongsTo( models.Ticker, {foreignKey: 'tickerId'})
  };
  return Holding;
};
