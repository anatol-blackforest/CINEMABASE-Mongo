//редактируем запись в базе
const MongoClient = require('./db').mongoClient;
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
            let ID = Number(req.body.id);
            let body = req.body;
            delete body.id;
            delete body.edit;
            //убрали старое изображение, если пришло новое
            collection.findOne({ID}).then(result => {
                if(result && result['preview'] && req.body.preview){
                    fs.unlink(`public/images/${result['preview']}`, err => {
                        if (err) throw err;
                    });
                }
            }).then(() => {
               collection.findOneAndUpdate(
                    // критерий выборки
                    {ID}, 
                    // параметр обновления
                    {$set: req.body},
                    err => {                 
                        if (err) throw err;
                    }
                )
            }).then(() => {
                db.close(); 
            }).then(callback).catch(err => {
                console.log(`Пизданулось :( ${err}`);
            }); 
        } else {
            db.close(); 
        }
    });
};