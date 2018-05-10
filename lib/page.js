//считываем фильмы с базы
const {MongoClient, url, postsPerPage} = require('./config');
let {pagination} = require('./config');
let db;

module.exports = async (num, callback) => {
    try{
        db = await MongoClient.connect(url)
        const collection = await db.collection('films')
        const cursor = await collection.find()
        let count = await cursor.count()
        cursor.sort({ date: -1 }).skip((num-1)*postsPerPage).limit(postsPerPage).toArray(callback);
        db.close();
        console.log("page");
    }catch(err){
        callback()
        if (db) db.close();
        console.error(err)
    }
};
