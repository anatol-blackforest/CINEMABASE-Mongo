//считываем фильмы с базы
const {postsPerPage} = require('./config');
const {getDB} = require('./mongodb');
let {pagination} = require('./config');

module.exports = async (num, callback) => {
    try{
        const db = getDB()
        const collection = await db.collection('films')
        const cursor = await collection.find()
        let count = await cursor.count()
        pagination.pages = Math.ceil(count / postsPerPage)
        pagination.openPager = (count > postsPerPage)
        pagination.activePage = parseInt(num)
        cursor.sort({ date: -1 }).skip((num-1)*postsPerPage).limit(postsPerPage).toArray(callback);
        console.log("page");
    }catch(err){
        callback()
        console.error(err)
    }
};


