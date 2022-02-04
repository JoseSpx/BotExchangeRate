'use strict';
const AWS = require('aws-sdk');
const logger = require('pino')();
const SNS = new AWS.SNS();

const { topicArn } = process.env;

module.exports.processorData = async (event) => {
  logger.info('Event:');
  logger.info(event);
  
  const records = event.Records;
  records.forEach(item => {
    if (item.eventName !== 'INSERT') return;
    const data = item.dynamodb.NewImage;
    logger.info('Exchange Data');
    logger.info(data);

    SNS.publish({
      Message: JSON.stringify(data),
      TopicArn: topicArn
    }, (err, data) => {
      if (err) {
        logger.error(err.stack);
        return;
      }
      logger.info('push sent');
      logger.info(data);
    })
  })
};
