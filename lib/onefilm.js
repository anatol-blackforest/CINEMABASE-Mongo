//страничка конкретного фильма
const {MongoClient, ObjectId, url, regexp} = require('./config');
const fs = require('fs');

module.exports = function(_id, callback) {
    MongoClient.connect(url, (err, db) => {
        if(err) return console.error(err);
        // _id - вещь хрупкая, валидируем ее. Если пришел бред - отлавливаем и кидаем рендер на ошибку 404
        if(_id.search(regexp) === -1 && _id.length === 24){
            db.collection('films').findOne({_id: ObjectId(_id)}).then(result => callback(null, [result])).then(() => {
                db.close();
                console.log("onefilm");
            });
        }else{
            callback(new Error(`Что-то пошло не так`));
            db.close();
            console.log(new Error(`Что-то пошло не так`));
        }
   });
};
