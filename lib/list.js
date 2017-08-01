//считываем фильмы с базы
const {MongoClient, url} = require('./config');

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