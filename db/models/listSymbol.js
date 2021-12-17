'use strict';
module.exports = (sequelize, DataTypes) => {
  const ListSymbol = sequelize.define('ListSymbol', {
    symbolId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Symbols',
        key: 'id'
      }
    },
    listId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Lists',
        key: 'id'
      }
    },
  }, { tableName: 'List_Symbols' });
  return ListSymbol;
};
