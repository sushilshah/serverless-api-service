'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update_org = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  // validation
  // if (typeof data.text !== 'string' || typeof data.checked !== 'boolean') {
  //   console.error('Validation Failed');
  //   callback(null, {
  //     statusCode: 400,
  //     headers: { 'Content-Type': 'text/plain' },
  //     body: 'Couldn\'t update the todo item.',
  //   });
  //   return;
  // }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeNames: {
      '#todo_text': 'text',
    },
    ExpressionAttributeValues: {
      ':text': data.text,
      ':checked': data.checked,
      ':updatedAt': timestamp,
    },
    UpdateExpression: 'SET #todo_text = :text, checked = :checked, updatedAt = :updatedAt',
    ReturnValues: 'ALL_NEW',
  };

  // update the todo in the database
  dynamoDb.update(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todo item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};


module.exports.update = (event, context, callback) => {

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
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the todo item.',
      });
      return;
      // context.fail(err);
    } 
      // context.succeed('Lambda_B said '+ data.Payload);
    // return callback(null, {
    //   statusCode: 200,
    //   headers: { 'Content-Type': 'text/plain' },
    //   body: data,
    // });
     // create a response
     const response = {
      statusCode: 200,
      body: data.Payload,
    };
    callback(null, response);
  })

  // const timestamp = new Date().getTime();
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