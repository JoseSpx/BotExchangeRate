'use strict';
const AWS = require('aws-sdk');
const logger = require('pino')();
const SNS = new AWS.SNS();

const { topicArn } = process.env;

module.exports.processorData = async (event) => {
  logger.info('Event:');
  logger.info(event);
  
  const records = event.Records;
  for(const item of records) {
    if (item.eventName !== 'INSERT') return;
    const data = item.dynamodb.NewImage;
    logger.info({ description: 'Exchange Data'}, data);

    const message = {
      buyPrice: data.buySell['S'].split('/')[0],
      sellPrice: data.buySell['S'].split('/')[1],
      dayRate: data.dayRate['S'],
      lastClose: data.lastClose['S']
    }
    
    try {
      const result = await SNS.publish({
        Message: JSON.stringify(message),
        TopicArn: topicArn
      }).promise();
    
      logger.info(result);
    } catch(err) {
      logger.error(err);
    }
  }

};
