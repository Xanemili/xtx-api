'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserList = sequelize.define('UserList', {
    symbolId: DataTypes.INTEGER,
    listId: DataTypes.INTEGER
  }, { tableName: 'Users_Lists'});
  UserList.associate = function(models) {
    UserList.belongsTo(models.List, {foreignKey: 'listId'});
    UserList.belongsTo(models._Symbol, {foreignKey: 'symbolId'});
  };
  return UserList;
};
