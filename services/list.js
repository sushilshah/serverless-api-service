'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
  TableName: process.env.DYNAMODB_TABLE,
};

module.exports.list = (event, context, callback) => {
  // fetch all todos from the database
  console.log('DYNAMODB_TABLE_TEST*********************************')
  console.log(process.env.DYNAMODB_TABLE_TEST)
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the devices.',
      });
      return;
    }

    // const response = {
    //   statusCode: 200,
    //   headers: {
    //     "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
    //     "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
    //   },
    //   body: JSON.stringify({ "message": "Hello World!" })
    // };

    // create a response
    const response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
      },
      body: JSON.stringify(result.Items),
    };
    callback(null, response);
  });
};

module.exports.getReadings = (event, context, callback) => {
  
  var _device_id = event.pathParameters.id
  
  const params = {
    TableName: process.env.DEVICE_READINGS_DYNAMODB_TABLE,
    FilterExpression: "#id = :id_val",
    ExpressionAttributeNames: {
        "#id": "id",
    },
    ExpressionAttributeValues: {
         ":id_val": _device_id
    }
  };
  console.log('DYNAMODB_TABLE_TEST*********************************')
  console.log(process.env.DEVICE_READINGS_DYNAMODB_TABLE)
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the devices.',
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
      body: JSON.stringify(result.Items),
    };
    callback(null, response);
  });
};


module.exports.getReadings1 = (event, context, callback) => {
  // const params = {
  //   TableName: process.env.DYNAMODB_TABLE,
  //   Key: {
  //     id: event.pathParameters.id,
  //   },
  // };
  // return callback(null, {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     message: 'Hello nice to meet you!',
  //     input: event,
  //     TableName: process.env.DYNAMODB_TABLE,
  //     AnotherTableName: process.env.DYNAMODB_TABLE_TEST,
  //     AlertTableName: process.env.DYNAMODB_ALERTS_TABLE
  //   }),
  // });
  // fetch todo from the database
  // dynamoDb.get(params, (error, result) => {
  //   // handle potential errors
  //   if (error) {
  //     console.error(error);
  //     callback(null, {
  //       statusCode: error.statusCode || 501,
  //       headers: { 'Content-Type': 'text/plain' },
  //       body: 'Couldn\'t fetch the todo item.',
  //     });
  //     return;
  //   }

  //   // create a response
  //   const response = {
  //     statusCode: 200,
  //     body: JSON.stringify(result.Item),
  //   };
  //   callback(null, response);
  // })


  // _params = {
  //   TableName: process.env.DEVICE_READINGS_DYNAMODB_TABLE,
  //   ProjectionExpression: "#yr, title, info.rating",
  //   FilterExpression: "#yr between :start_yr and :end_yr",
  //   ExpressionAttributeNames: {
  //       "#yr": "year",
  //   },
  //   ExpressionAttributeValues: {
  //        ":start_yr": 1950,
  //        ":end_yr": 1959 
  //   }
  // };
  const _params = {
    TableName: process.env.DEVICE_READINGS_DYNAMODB_TABLE,
    FilterExpression: "#id = :id_val",
    ExpressionAttributeNames: {
        "#id": "id",
    },
    ExpressionAttributeValues: {
         ":id_val": 1
    }
  };
  console.log("Scanning Movies table.");
  dynamoDb.scan(_params, onScan, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the devices.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
    console.log("Print response");
    console.log(response);
    callback(null, response);
  });

  function onScan(err, data) {
      if (err) {
          console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
      } else {
          // print all the movies
          console.log("Scan succeeded.");
          data.Items.forEach(function(movie) {
            console.log(movie);
          });

          // continue scanning if we have more movies, because
          // scan can retrieve a maximum of 1MB of data
          if (typeof data.LastEvaluatedKey != "undefined") {
              console.log("Scanning for more...");
              _params.ExclusiveStartKey = data.LastEvaluatedKey;
              dynamoDb.scan(_params, onScan);
          }
      }
  }
};
