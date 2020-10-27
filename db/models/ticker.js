'use strict';
module.exports = (sequelize, DataTypes) => {
  const Ticker = sequelize.define('Ticker', {
    ticker: DataTypes.STRING
  }, {});
  Ticker.associate = function(models) {
    // associations can be defined here
  };
  return Ticker;
};
