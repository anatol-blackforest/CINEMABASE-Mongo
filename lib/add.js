//добавляем фильм в базу
const {MongoClient, url} = require('./config');
let db;

module.exports = async ({file, body}, res, callback) => {
    try{
        db = await MongoClient.connect(url)
        if(file && file.filename) body.preview = file.filename
        if(body && body.title && body.about){
            const collection = await db.collection('films')
            await collection.insertOne({...body, date: new Date().toLocaleString()})
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
