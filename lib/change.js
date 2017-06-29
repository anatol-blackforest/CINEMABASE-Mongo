//редактируем запись в базе
const MongoClient = require('./db').mongoClient;
const ObjectId = require('./db').ObjectId;
const url = require('./db').url;
const fs = require('fs');

module.exports = function(req, res, callback) {
     MongoClient.connect(url, (err, db) => {
        let collection = db.collection('films');
        if (req.body && req.file && req.file.filename){
            req.body.preview = req.file.filename;
        };
        //логика редактирования
        if (req.body && req.body.title && req.body.about){
            let _id = ObjectId(req.body._id);
            let body = req.body;
            delete body.edit;
            delete body._id;
            //убрали старое изображение, если пришло новое
            collection.findOne({_id}).then(result => {
                if(result && result['preview'] && req.body.preview){
                    fs.unlink(`public/images/${result['preview']}`, err => {
                        if (err) throw err;
                    });
                }
            }).then(() => {
               collection.findOneAndUpdate(
                    // критерий выборки
                    {_id}, 
                    // параметр обновления
                    {$set: body},
                    err => {                 
                        if (err) throw err;
                    }
                )
            }).then(() => {
                db.close(); 
                console.log("changed");
            }).then(callback).catch(err => {
                console.log(`Пизданулось :( ${err}`);
            }); 
        } else {
            db.close(); 
        }
    });
};