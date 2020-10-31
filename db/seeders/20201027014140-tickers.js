'use strict';
// const APIKEY = process.env.POLYGONIO_API_KEY || '';
// const {
//   restClient
// } = require('polygon.io')

// const rest = restClient(APIKEY)


module.exports = {
  up: async (queryInterface, Sequelize) => {

      // const data = await rest.reference.tickers({
      //   sort: 'ticker',
      //   market: 'STOCKS',
      //   locale: 'US',
      //   type: 'cs'
      // })

      // let numberOfRequests = Math.floor(data.count / data.perPage);
      // let tickers = data.tickers
      // let page = data.page + 1

      // console.log(numberOfRequests)

      // while (page < numberOfRequests) {
      //   const newPage = await rest.reference.tickers({
      //     sort: 'ticker',
      //     market: 'STOCKS',
      //     locale: 'US',
      //     type: 'cs',
      //     page
      //   });

      //   tickers.concat(newPage.tickers);

      //   page++
      // }


      let tickers = [{ticker: 'CASH', market: 'CASH', name: 'CASH'}, {ticker: 'PORT_VAL', market: 'PORT', name: 'PORTFOLIO_VALUE'}]

    return queryInterface.bulkInsert('Tickers', tickers)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tickers')
  }
};
