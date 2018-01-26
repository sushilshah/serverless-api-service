'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Hello nice to meet you!',
        input: event,
        TableName: process.env.DYNAMODB_TABLE,
        AnotherTableName: process.env.DYNAMODB_TABLE_TEST
      }),
    });
};
