//страничка конкретного фильма
const MongoClient = require('./db').mongoClient;
const ObjectId = require('./db').ObjectId;
const url = require('./db').url;
const fs = require('fs');

module.exports = function(_id, callback) {
    MongoClient.connect(url, (err, db) => {
        if(err) return console.log(err);
        db.collection('films').findOne({_id: ObjectId(_id)}).then(result => {
            callback(err, [result]);
        }).then(() => {
            db.close();
            console.log("onefilm");
        });
   });
};