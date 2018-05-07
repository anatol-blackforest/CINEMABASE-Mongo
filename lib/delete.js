//удаляем фильм и его постер из базы
const {MongoClient, ObjectId, url, regexp} = require('./config');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs');
const stat = promisify(fs.stat);
let db;

module.exports = async (req, callback) => {
    try{
        db = await MongoClient.connect(url)
        // _id - вещь хрупкая, валидируем ее. Если пришел бред - отлавливаем и кидаем рендер на ошибку 404
        let _id = req.params.id
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
            console.log("deleted");
        }
        db.close();
    }catch(err){
        callback()
        if (db) db.close();
        console.error(err)
    }
};
