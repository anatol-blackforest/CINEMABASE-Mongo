//удаляем фильм и его постер из базы
const {MongoClient, ObjectId, url, regexp} = require('./config');
const path = require('path');
const fs = require('fs');

module.exports = function(req, callback) {
   MongoClient.connect(url, (err, db) => {
        // _id - вещь хрупкая, валидируем ее. Если пришел бред - отлавливаем и кидаем рендер на ошибку 404
        let _id = req.params.id
        if(_id.search(regexp) === -1 && _id.length === 24){
            const collection = db.collection('films');
            _id = ObjectId(_id);
            collection.findOne({_id}).then(result => {
                if(result && result['preview']){
                    fs.stat(path.join('public', 'images', result['preview']), err => {
                        if(err) return console.error(err);
                        fs.unlink(path.join('public', 'images', result['preview']), err => {
                            if(err) console.error(err);
                        });
                    });
                }
            }).then(() => {
                collection.deleteOne({_id}, err => { 
                    if (err) throw err;
                });
            }).then(() => {
                db.close(); 
                console.log("deleted");
            }).then(callback).catch(err => console.error(new Error(`Что-то пошло не так: ${err.message}`))); 
        }else{
            callback(new Error(`Что-то пошло не так`));
            db.close();
            console.log(new Error(`Что-то пошло не так`));
        }
   });
};
