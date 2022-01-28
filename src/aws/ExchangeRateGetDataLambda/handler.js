const ExchangeRate = require('./functions/exchangeRate');
const Test = require('./functions/test');

module.exports = {
  ...ExchangeRate,
  ...Test
}

