//считываем фильмы с базы
const MongoClient = require('./config').mongoClient;
const url = require('./config').url;

module.exports = function(callback) {
    MongoClient.connect(url, (err, db) => {
        if(err) return console.log(err);
        db.collection('films').find((err, cursor) => {
            if(err) return console.log(err);
            cursor.toArray(callback);
            db.close();
            console.log("listed");
        });
    }); 
};