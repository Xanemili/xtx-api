'use strict';



module.exports = {
  up: async (queryInterface, Sequelize) => {

      const data = await rest.reference.tickers({
        sort: 'ticker',
        market: 'STOCKS',
        locale: 'US',
        type: 'cs'
      })

      let numberOfRequests = Math.ceil(data.count / data.perPage);
      let tickers = data.tickers
      let page = data.page + 1

      console.log(numberOfRequests)

      while (page < numberOfRequests) {
        const newPage = await rest.reference.tickers({
          sort: 'ticker',
          market: 'STOCKS',
          locale: 'US',
          type: 'cs',
          page
        });

        console.log(newPage)

        tickers.concat(newPage.tickers);

        page++
      }

      let cash = [{ticker: 'CASH', EODPrice: 1.00}]

      tickers.concat(cash)

    return queryInterface.bulkInsert('Tickers', tickers)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tickers')
  }
};
