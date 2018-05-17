//добавляем фильм в базу
const {getDB} = require('./mongodb');
const {added} = require('./messages');

module.exports = async (req, res, callback) => {
    try{
        const db = getDB()
        if(req.file && req.file.filename) req.body.preview = req.file.filename
        if(req.body && req.body.title && req.body.about){
            const collection = await db.collection('films')
            await collection.insertOne({...req.body, date: new Date().toLocaleString()})
            console.log(added)
        }
        callback()
    }catch(err){
        callback()
        console.error(err)
    }
};
