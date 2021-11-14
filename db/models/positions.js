'use strict';
module.exports = (sequelize, DataTypes) => {
  const Position = sequelize.define('Position', {
    userId: DataTypes.INTEGER,
    symbolId: DataTypes.INTEGER,
    quantity: DataTypes.FLOAT,
    wavg_cost: DataTypes.FLOAT,
  }, {});
  Position.associate = function(models) {
    Position.belongsToMany(models._Symbol, { through: 'Position_Symbols' })
    Position.belongsTo(models.User, { foreignKey: 'userId' })
  };
  return Position;
};
