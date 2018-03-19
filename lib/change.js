//редактируем запись в базе
const {MongoClient, ObjectId, url, regexp} = require('./config');
const path = require('path');
const fs = require('fs');

module.exports = function(req, res, callback) {
     MongoClient.connect(url, (err, db) => {
            const collection = db.collection('films');
            if (req.body && req.file && req.file.filename) req.body.preview = req.file.filename;
            //логика редактирования
            if (req.body && req.body.title && req.body.about){
                // _id - вещь хрупкая, валидируем ее. Если пришел бред - отлавливаем и кидаем ошибку
                let _id = req.body._id
                if(_id.search(regexp) === -1 && _id.length === 24){
                    _id = ObjectId(_id);
                    const body = req.body;
                    delete body.edit;
                    delete body._id;
                    //убрали старое изображение, если пришло новое
                    collection.findOne({_id}).then(result => {
                        if(result && result['preview'] && body.preview){
                            fs.stat(path.join('public', 'images', result['preview']), err => {
                                if(err) return console.error(err);
                                fs.unlink(path.join('public', 'images', result['preview']), err => {
                                    if(err) console.error(err);
                                });
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
                        console.log("changed");
                        db.close(); 
                    }).then(callback).catch(err => {
                        console.error(new Error(`Что-то пошло не так: ${err.message}`));
                        db.close(); 
                    }); 
                }else{
                    callback(new Error(`Что-то пошло не так`));
                    db.close();
                    console.log(new Error(`Что-то пошло не так`));
                }
            } else {
                db.close(); 
            }
    });
};
