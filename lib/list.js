//считываем фильмы с базы
const {MongoClient, url, postsPerPage} = require('./config');
let {pagination} = require('./config');
let db;

module.exports = async callback => {
    try{
        db = await MongoClient.connect(url)
        const collection = await db.collection('films')
        const cursor = await collection.find()
        let count = await cursor.count()
        pagination.pages = Math.ceil(count / postsPerPage)
        pagination.openPager = (count > postsPerPage)
        cursor.sort({ date: -1 }).limit(postsPerPage).toArray(callback);
        db.close();
        console.log("listed");
    }catch(err){
        callback()
        if (db) db.close();
        console.error(err)
    }
};
