'use strict';
const logger = require('pino')();

module.exports.publishToTwitter = async (event) => {
  logger.info('Data Received');
  logger.info(event);
};
