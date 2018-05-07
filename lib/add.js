//добавляем фильм в базу
const {MongoClient, url} = require('./config');

module.exports = async (req, res, callback) => {
    try{
        const db = await MongoClient.connect(url)
        if(req.file && req.file.filename) req.body.preview = req.file.filename
        if(req.body && req.body.title && req.body.about){
            const collection = await db.collection('films')
            await collection.insertOne(req.body)
            callback()
            db.close()
            console.log("added")
        };
    }catch(err){
        callback()
        console.error(err)
    }
};
