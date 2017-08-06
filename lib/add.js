//добавляем фильм в базу
const {MongoClient, url} = require('./config');

module.exports = function(req, res, callback) {
    MongoClient.connect(url, (err, db) => {
        if(err) return console.error(err);
        if(req.file && req.file.filename){
            req.body.preview = req.file.filename;
        };
        if(req.body && req.body.title && req.body.about){
            db.collection('films').insertOne(req.body).then(results => {
                callback(err, results);
            }).then(() => {
                db.close();
                console.log("added");
            });
        };
     }); 
};
