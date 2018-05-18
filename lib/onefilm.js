//страничка конкретного фильма
const {regexp} = require('./config');
const {ObjectId} = require('./mongodb');
const {onefilm} = require('./messages');
const fs = require('fs');

module.exports = async ({db, params:{id}}, callback) => {
    try{
        let _id = id
        // _id - вещь хрупкая, валидируем ее. Если пришел бред - отлавливаем и кидаем рендер на ошибку 404
        if(_id.search(regexp) === -1 && _id.length === 24){
            const result = await db.collection('films').findOne({_id: ObjectId(_id)})
            if(result){
               callback(null, [result])
            }else{
               callback(new Error())
            }
            console.log(onefilm);
        }else{
            callback(new Error());
        }
    }catch(err){
        callback()
        console.error(err)
    }
};
