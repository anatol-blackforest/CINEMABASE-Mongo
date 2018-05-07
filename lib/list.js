//считываем фильмы с базы
const {MongoClient, url} = require('./config');
let db;

module.exports = async (callback) => {
    try{
        db = await MongoClient.connect(url)
        const collection = await db.collection('films')
        const cursor = await collection.find()
        cursor.toArray(callback);
        db.close();
        console.log("listed");
    }catch(err){
        callback()
        db.close();
        console.error(err)
    }
};
