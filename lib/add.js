//добавляем фильм в базу
const mongoClient = require('./db').mongoClient;
const url = require('./db').url;

module.exports = function(req, res, callback) {
    mongoClient.connect(url, function(err, db){
        if(err) return console.log(err);
        req.body.ID = Date.now();
        if(req.file && req.file.filename){
            req.body.preview = req.file.filename;
        };
        if(req.body && req.body.title && req.body.about){
            db.collection('films').insertOne(req.body, callback, function(err, result){
                if(err) return console.log(err);
                db.close();
            });
        };
     }); 
};