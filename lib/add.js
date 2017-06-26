//добавляем фильм в базу
const MongoClient = require('./db').mongoClient;
const url = require('./db').url;

module.exports = function(req, res, callback) {
    MongoClient.connect(url, (err, db) => {
        if(err) return console.log(err);
        if(req.file && req.file.filename){
            req.body.preview = req.file.filename;
        };
        if(req.body && req.body.title && req.body.about){
            db.collection('films').insertOne(req.body, (err, results) => {
                if(err) return console.log (err);
                callback(err, results);
                db.close();
                console.log("added");
            });
        };
     }); 
};
