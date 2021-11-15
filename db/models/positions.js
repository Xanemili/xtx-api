'use strict';
module.exports = (sequelize, DataTypes) => {
  const Position = sequelize.define('Position', {
    userId: DataTypes.INTEGER,
    symbolId: DataTypes.INTEGER,
    quantity: DataTypes.FLOAT,
    wavg_cost: DataTypes.FLOAT,
  }, {});
  Position.associate = function(models) {
    Position.belongsTo(models._Symbol, { foreignKey: 'symbolId' })
    Position.belongsTo(models.User, { foreignKey: 'userId' })
  };
  return Position;
};
