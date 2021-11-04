'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    const updateTickerName = queryInterface.changeColumn('Tickers', 'name', {
      allowNull: true,
      defaultValue: null,
      type: Sequelize.STRING(255),
    })

    const updateTickerMarket = queryInterface.changeColumn('Tickers', 'market', {
      allowNull: true,
      defaultValue: null,
      type: Sequelize.STRING(15)
    })
    return Promise.all([updateTickerName, updateTickerMarket])
  },
  down: (queryInterface, Sequelize) => {
    const downgradeTicker = [
      queryInterface.changeColumn('Tickers', 'name', {
      allowNull: false,
      type: Sequelize.STRING(255),
    }),
      queryInterface.changeColumn('Tickers', 'market', {
        allowNull: false,
        type: Sequelize.STRING(15)
    })]

    return Promise.all(downgradeTicker)
  }
}
