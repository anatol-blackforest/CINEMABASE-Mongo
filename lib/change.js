//редактируем запись в базе
const {regexp} = require('./config');
const {getDB, ObjectId} = require('./mongodb');
const {promisify} = require('util');
const path = require('path');
const fs = require('fs');
const stat = promisify(fs.stat);

module.exports = async (req, res, callback) => {
    try{
        const db = getDB()
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
                //критерий выборки и параметр обновления
                await collection.findOneAndUpdate({_id},{$set: body})
                console.log("changed");
                callback();
            }else{
                callback(new Error());
            }
        }  
    }catch(err){
        callback()
        console.error(err)
    }
};
