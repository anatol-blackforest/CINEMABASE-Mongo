//страничка конкретного фильма
const {MongoClient, ObjectId, url} = require('./config');
const fs = require('fs');

let currId;

module.exports = function(_id, callback) {
    MongoClient.connect(url, (err, db) => {
        if(err) return console.error(err);
        // _id - вещь хрупкая, валидируем ее. Если пришел бред - отлавливаем и кидаем рендер на ошибку 404
        try {
            _id = ObjectId(_id);
            db.collection('films').findOne({_id}).then(result => callback(null, [result])).then(() => {
                db.close();
                console.log("onefilm");
            });
        } catch (err) {
            callback(err)
            db.close();
            console.log(new Error(`Что-то пошло не так: ${err.message}`));
        }
   });
};
