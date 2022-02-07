'use strict';
const AWS = require('aws-sdk');
const logger = require('pino')();
const { TwitterApi } = require('twitter-api-v2');

const { ssmArn } = process.env;

const getSSMCredentials = async () => {
  const ssm = new AWS.SecretsManager({region: 'us-east-2'});
  const parameterPromise = await ssm.getSecretValue({ SecretId: ssmArn }).promise();
  return JSON.parse(parameterPromise.SecretString);
}


module.exports.publishToTwitter = async (event) => {
  logger.info({ description: 'Event Received:' }, event);
  const credentials = await getSSMCredentials();
  const data = JSON.parse(event.Records[0].Sns.Message);

  const tweetApi = new TwitterApi({
    appKey: credentials.apiKey,
    appSecret: credentials.apiSecretKey,
    accessToken: credentials.accessToken,
    accessSecret: credentials.accessSecretToken
  });

  try {
    const message = `USD-PE Precio Compra: ${data.buyPrice} \nPrecio Venta ${data.sellPrice} \nid:${Math.random()}`
    const result = await tweetApi.v2.tweet(message);
    console.log('Successful: ', result);
  } catch(err) {
    console.log('error', err);
  }

};
