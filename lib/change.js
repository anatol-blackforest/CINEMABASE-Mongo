//редактируем запись в базе
const {MongoClient, ObjectId, url} = require('./config');
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
                    fs.stat(`public/images/${result['preview']}`, (err, exists) => {
                        if(err) console.error(err);
                        if(exists){
                            fs.unlink(`public/images/${result['preview']}`, err => {
                                if(err) console.error(err);
                            });
                        }
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
                console.error(`Пизданулось :( ${err}`);
                db.close(); 
            }); 
        } else {
            db.close(); 
        }
    });
};
