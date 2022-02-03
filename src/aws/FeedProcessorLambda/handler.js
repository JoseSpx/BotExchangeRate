'use strict';
const logger = require('pino')();

module.exports.processorData = async (event) => {
  logger.info(`Data Event : ${JSON.stringify(event)}`);
  logger.info(event);  
};
