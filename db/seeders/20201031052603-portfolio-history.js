'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {


  //   let data = []
  //   for(let i=1; i<30; i++){
  //     let date = new Date(`2020-10-${i}`);

  //     data.push({
  //       userId: 1,
  //       tickerId: 2,
  //       price: 1.00,
  //       amount: 1.00,
  //       tradeTotal: (9000 + i*72),
  //       isOpen: false,
  //       createdAt: date,
  //       updatedAt: date
  //     })
  //   }
  //  return queryInterface.bulkInsert('Ledgers', data)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Ledgers', null, {});
  }
};
