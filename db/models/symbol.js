'use strict';
module.exports = (sequelize, DataTypes) => {
  const _Symbol = sequelize.define('_Symbol', {
    symbol: DataTypes.STRING,
    name: DataTypes.STRING,
    market: DataTypes.STRING,
    url: DataTypes.STRING,
  }, {
    tableName: 'Symbols'
  });
  _Symbol.associate = function(models) {
    _Symbol.hasMany(models.Ledger, {foreignKey: 'symbolId'})
    _Symbol.belongsToMany(models.List, {through: models.ListSymbol, foreignKey: 'symbolId', as: 'lists'})
    _Symbol.belongsToMany(models.Position, { through: 'Position_Symbols' })
  };
  return _Symbol;
};
