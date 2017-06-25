//удаляем фильм и его постер из базы
const MongoClient = require('./db').mongoClient;
const ObjectId = require('./db').ObjectId;
const url = require('./db').url;
const fs = require('fs');

module.exports = function(_id, callback) {
   MongoClient.connect(url, (err, db) => {
        let collection = db.collection('films');
        collection.findOne({_id: ObjectId(_id)}).then(result => {
            if(result && result['preview']){
                fs.unlink(`public/images/${result['preview']}`, err => {
                    if (err) throw err;
                });
            }
        }).then(() => {
            collection.deleteOne({_id: ObjectId(_id)}, err => { 
                if (err) throw err;
            });
        }).then(() => {
            db.close(); 
        }).then(callback).catch(err => {
            console.log(`Пизданулось :( ${err}`);
        }); 
    });
};