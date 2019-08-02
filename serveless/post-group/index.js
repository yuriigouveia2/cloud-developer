const uuid = require('uuid');
const AWS = require('aws-sdk');

const docClient = new AWS.DynamoDB.DocumentClient();
const groupsTable = process.env.URL;

exports.handler = async (event) => {
    const itemId = uuid.v4();
    const parsedBody = JSON.parse(event.body);

    const newItem = {
        id: itemId,
        ...parsedBody
    };

     await docClient.put({
         TableName: groupsTable,
         Item: newItem
     }).promise();

     return {
         statusCode: 201,
         headers: {
             'Access-Control-Allow-Origin':'*'
         },
         body: JSON.stringify({
             newItem
         })
     }
}