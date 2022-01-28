'use strict';
const scrapeIt = require("scrape-it")


const getExchangeRateData = async (event) => {
  const data = await scrapeIt('https://es.investing.com/currencies/usd-pen', {
    exchangeRate: '.instrument-price_instrument-price__3uw25 .text-2xl',
    lastClose: {
      selector: '.trading-hours_trading-hours-item__BSxaF .trading-hours_value__2MrOn',
      eq: 0
    },
    buySell: {
      selector: '.trading-hours_trading-hours-item__BSxaF .trading-hours_value__2MrOn',
      eq: 1
    },
    dayRate: {
      selector: '.trading-hours_trading-hours-item__BSxaF .trading-hours_value__2MrOn',
      eq: 2
    }
  });

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        payload: data.data
      },
      null,
      2
    ),
  }
}


module.exports = {
  getExchangeRateData
}