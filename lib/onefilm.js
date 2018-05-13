//страничка конкретного фильма
const {MongoClient, ObjectId, url, regexp} = require('./config');
const fs = require('fs');
let db;

module.exports = async (_id, callback) => {
    try{
        db = await MongoClient.connect(url)
        // _id - вещь хрупкая, валидируем ее. Если пришел бред - отлавливаем и кидаем рендер на ошибку 404
        if(_id.search(regexp) === -1 && _id.length === 24){
            const result = await db.collection('films').findOne({_id: ObjectId(_id)})
            if(result){
               callback(null, [result])
            }else{
               callback(new Error())
            }
            db.close();
            console.log("onefilm");
        }else{
            callback(new Error());
            db.close();
        }
    }catch(err){
        callback()
        if (db) db.close();
        console.error(err)
    }
};
