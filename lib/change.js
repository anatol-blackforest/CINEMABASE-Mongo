//редактируем запись в базе
const {MongoClient, ObjectId, url, regexp} = require('./config');
const {promisify} = require('util');
const path = require('path');
const fs = require('fs');
const stat = promisify(fs.stat);
let db;

module.exports = async (req, res, callback) => {
    try{
        db = await MongoClient.connect(url)
        const collection = await db.collection('films');
        if (req.body && req.file && req.file.filename) req.body.preview = req.file.filename;
        //логика редактирования
        if (req.body && req.body.title && req.body.about){
            // _id - вещь хрупкая, валидируем ее. Если пришел бред - отлавливаем и кидаем ошибку
            let _id = req.body._id
            if(_id.search(regexp) === -1 && _id.length === 24){
                _id = ObjectId(_id);
                const body = req.body;
                delete body.edit;
                delete body._id;
                //убрали старое изображение, если пришло новое
                const result = await collection.findOne({_id})
                if(result && result['preview'] && body.preview){
                    await stat(path.join('public', 'images', result['preview']))
                    await fs.unlink(path.join('public', 'images', result['preview']))
                }
                await collection.findOneAndUpdate(
                    // критерий выборки
                    {_id}, 
                    // параметр обновления
                    {$set: body}
                )
                console.log("changed");
                db.close(); 
                callback();
            }else{
                callback(new Error(`Что-то пошло не так`));
                db.close();
                console.log(new Error(`Что-то пошло не так`));
            }
        } else {
            db.close(); 
        }
    }catch(err){
        callback()
        if (db) db.close();
        console.error(err)
    }
};
