'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {


    // let data = []
    // let val = 9000
    // for(let j=9; j > 1; j--) {
    //   for (let i = 1; i < 28; i++) {

    //     let date = new Date(`2020-${j}-${i}`);
    //     val += Math.random() * 400 - Math.random() * 250
    //     data.push({
    //       userId: 1,
    //       tickerId: 2,
    //       price: 1.00,
    //       amount: 1.00,
    //       tradeTotal: val,
    //       isOpen: false,
    //       createdAt: date,
    //       updatedAt: date
    //     })
    //   }
    // }
    // return queryInterface.bulkInsert('Ledgers', data)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Ledgers', null, {});
  }
};
