'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create_org = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (typeof data.text !== 'string') {
    console.error('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create the todo item.',
    });
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      text: data.text,
      checked: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  // write the todo to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the todo item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};


module.exports.create_test = (event, context, callback) => {

  return callback(null, {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
      "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
    },
    body: JSON.stringify({
      message: 'Hello nice to meet you!',
      input: event,
      TableName: process.env.DYNAMODB_TABLE,
      AnotherTableName: process.env.DYNAMODB_TABLE_TEST
    }),
  });
};

module.exports.create = (event, context, callback) => {
  console.log("Event input body");
  console.log(event);
  console.log(event.body);

  var lambda = new AWS.Lambda();
  var payload = {
    "id" : "namah",
    "humidity" : 10,
    "x" : 12,
    "y": 11
   }
  var params = {
    FunctionName: 'device-message-receiver', // the lambda function we are going to invoke
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    Payload: JSON.stringify(payload)
  };

  lambda.invoke(params, function(err, data) {
    console.log("Lambda invoke");
    console.log(data);
    console.log("error");
    console.log(err);
    if (err) {
      callback(null, {
        statusCode: err.statusCode || 501,
        headers: {
          "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
        },
        body: 'Couldn\'t fetch the todo item.',
      });
      return;
    } 
     // create a response
     const response = {
      statusCode: 200,
      headers: {
          "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
      },
      body: data.Payload,
    };
    callback(null, response);
  })



  // return callback(null, {
  //   statusCode: 200,
  //   headers: {
  //     "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
  //     "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
  //   },
  //   body: JSON.stringify({
  //     message: 'Hello nice to meet you!',
  //     input: event,
  //     TableName: process.env.DYNAMODB_TABLE,
  //     AnotherTableName: process.env.DYNAMODB_TABLE_TEST
  //   }),
  // });
};