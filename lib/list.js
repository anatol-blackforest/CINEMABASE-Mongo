//считываем фильмы с базы
const {postsPerPage} = require('./config');
let {pagination} = require('./config');
const {listed} = require('./messages');

module.exports = async ({db}, callback) => {
    try{
        const collection = await db.collection('films')
        const cursor = await collection.find()
        let count = await cursor.count()
        pagination.pages = Math.ceil(count / postsPerPage)
        pagination.openPager = (count > postsPerPage)
        cursor.sort({ date: -1 }).limit(postsPerPage).toArray(callback);
        console.log(listed);
    }catch(err){
        callback()
        console.error(err)
    }
};
