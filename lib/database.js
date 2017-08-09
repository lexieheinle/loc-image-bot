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
    dynamodb.putItem({
        "TableName": tablename,
        "Item": item,
    }, function(err, data) {
        if (err) {
            console.log('Error putting item into dynamodb failed: ' + err);
            return false;
        } else {
            console.log('great success: ' + JSON.stringify(data, null, '  '));
            return true;
        }
    })
}

module.exports = {
    addUser: addUser,
}
