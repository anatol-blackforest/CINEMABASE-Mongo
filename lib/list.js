//считываем фильмы с базы
const {MongoClient, url} = require('./config');

module.exports = function(callback) {
    MongoClient.connect(url, (err, db) => {
        if(err) return console.error(err);
        db.collection('films').find((err, cursor) => {
            if(err) return console.error(err);
            cursor.toArray(callback);
            db.close();
            console.log("listed");
        });
    }); 
};
