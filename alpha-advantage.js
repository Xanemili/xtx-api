const alpha = require('alphavantage')({
  key: '1VQHQEGV3T5XK5SX'
});

alpha.data.intraday(`msft`).then(data => {
  console.log(data);
});
