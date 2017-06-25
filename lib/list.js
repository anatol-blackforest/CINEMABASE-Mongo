//считываем фильмы с базы
const mongoClient = require('./db').mongoClient;
const url = require('./db').url;

module.exports = function(callback) {
    mongoClient.connect(url, function(err, db){
        if(err) return console.log(err);
        db.collection('films').find().toArray(callback, function(err){
            if(err) return console.log(err);
            console.log("listed");
            db.close();
        });
    }); 
};