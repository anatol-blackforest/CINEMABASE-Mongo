//поиск
const {MongoClient, url} = require('./config');

module.exports = function(search, callback) {
    MongoClient.connect(url, (err, db) => {
        if(err) return console.log(err);
        db.collection('films').find((err, cursor) => {
            if(err) return console.log(err);
            cursor.toArray(
                (err, result) => {
                    callback(err, result.filter(item => item.title.toLowerCase().indexOf(search.toLowerCase()) !== -1));
                    db.close();
                    console.log("searched");
                }
            );
        });
    }); 
};