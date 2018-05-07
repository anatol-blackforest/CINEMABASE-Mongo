//добавляем фильм в базу
const {MongoClient, url} = require('./config');
let db;

module.exports = async (req, res, callback) => {
    try{
        db = await MongoClient.connect(url)
        if(req.file && req.file.filename) req.body.preview = req.file.filename
        if(req.body && req.body.title && req.body.about){
            const collection = await db.collection('films')
            await collection.insertOne(req.body)
            console.log("added")
        }
        db.close()
        callback()
    }catch(err){
        callback()
        if (db) db.close();
        console.error(err)
    }
};
