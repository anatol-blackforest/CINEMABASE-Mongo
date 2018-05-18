//удаляем фильм и его постер из базы
const {regexp} = require('./config');
const {ObjectId} = require('./mongodb');
const {deleted} = require('./messages');
const {promisify} = require('util');
const path = require('path');
const fs = require('fs');
const stat = promisify(fs.stat);

module.exports = async ({db, params:{id}}, callback) => {
    try{
        let _id = id
        // _id - вещь хрупкая, валидируем ее. Если пришел бред - отлавливаем и кидаем рендер на ошибку 404
        if(_id.search(regexp) === -1 && _id.length === 24){
            const collection = db.collection('films')
            _id = ObjectId(_id);
            const result = await collection.findOne({_id})
            await collection.deleteOne({_id});
            if(result && result['preview']){
                await stat(path.join('public', 'images', result['preview']))
                await fs.unlink(path.join('public', 'images', result['preview']))
            }
            callback()
            console.log(deleted);
        }
    }catch(err){
        callback()
        console.error(err)
    }
};
