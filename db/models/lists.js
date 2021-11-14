'use strict';
module.exports = (sequelize, DataTypes) => {
  const List = sequelize.define('List', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  List.associate = function(models) {
    List.belongsToMany(models._Symbol, {through: 'UserList', foreignKey: 'listId'});
    List.belongsTo(models.User, {foreignKey: 'userId'});
  };
  return List;
};
