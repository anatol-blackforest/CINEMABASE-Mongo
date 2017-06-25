//удаляем фильм и его постер из базы
const MongoClient = require('./db').mongoClient;
const url = require('./db').url;
const fs = require('fs');

module.exports = function(ID, callback) {
   MongoClient.connect(url, function(err, db){
        let collection = db.collection('films');
        collection.findOne({ID:Number(ID)}).then(result => {
            if(result && result['preview']){
                fs.unlink(`public/images/${result['preview']}`, function(err){
                    if (err) throw err;
                });
            }
        }).then(() => {
            collection.deleteOne({ID:Number(ID)}, (err) => { 
                if (err) throw err;
            });
        }).then(() => {
            db.close(); 
        }).then(callback).catch(err => {
            console.log(`Пизданулось :( ${err}`);
        }); 
    });
};