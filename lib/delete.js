//удаляем фильм и его постер из базы
const {MongoClient, ObjectId, url} = require('./config');
const path = require('path');
const fs = require('fs');

module.exports = function(req, callback) {
   MongoClient.connect(url, (err, db) => {
        let collection = db.collection('films');
        let _id = ObjectId(req.params.id);
        collection.findOne({_id}).then(result => {
            if(result && result['preview']){
                fs.stat(path.join('public', 'images', result['preview']), (err, exists) => {
                    if(err) console.error(err);
                    if(exists){
                        fs.unlink(path.join('public', 'images', result['preview']), err => {
                            if(err) console.error(err);
                        });
                    }
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
    });
};
