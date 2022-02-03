'use strict';
const scrapeIt = require("scrape-it");
const AWS = require('aws-sdk');
const uuid = require('uuid');
const dayjs = require('dayjs');

const { IS_OFFLINE } = process.env;

// const dynamoDb = IS_OFFLINE === 'true' ? new AWS.DynamoDB.DocumentClient({region: 'localhost', endpoint: 'http://localhost:8000'}) : new AWS.DynamoDB.DocumentClient()
const dynamoDb = new AWS.DynamoDB.DocumentClient();

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


  const { lastClose, buySell, dayRate } = data.data;

  const params = {
    TableName: process.env.exchangeRateTableName,
    Item: {
      id: uuid.v4(),
      lastClose,
      buySell,
      dayRate,
      createdAt: dayjs().toISOString()
    },
  }

  try {
    await dynamoDb.put(params).promise();
  } catch(err) {
    return err;
  }
  

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        payload: {
          message: 'Successful',
          data: params.Item
        }
      },
      null,
      2
    )
  }

}


module.exports = {
  getExchangeRateData
}
