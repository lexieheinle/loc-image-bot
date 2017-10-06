const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const dynamodb = new AWS.DynamoDB();

function addUser(userId, searchTerm) {
    const tablename = "picture-subscribers";
    let item = {
        "SubscribeId": {
            S: userId
        },
        "term": {
          S: searchTerm
        }
    }
    const putItemPromise = dynamodb.putItem({
        "TableName": tablename,
        "Item": item,
    }).promise();
    return putItemPromise.then(function(data) {
      console.log('Success');
      return data;
    }).catch(function(err) {
      console.log(err);
      return err;
    })
}

module.exports = {
    addUser: addUser,
}
