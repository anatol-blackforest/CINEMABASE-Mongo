//считываем фильмы с базы
const {postsPerPage} = require('./config');
const {getDB, connectDB} = require('./mongodb');
let {pagination} = require('./config');
const {dbErr, dbConnected} = require('./messages');

module.exports = async callback => {
    try{
        const db = getDB()
        const collection = await db.collection('films')
        const cursor = await collection.find()
        let count = await cursor.count()
        pagination.pages = Math.ceil(count / postsPerPage)
        pagination.openPager = (count > postsPerPage)
        cursor.sort({ date: -1 }).limit(postsPerPage).toArray(callback);
        console.log("listed");
    }catch(err){
        callback()
        console.error(err)
    }
};
