//поиск
const {notFound} = require('./messages');
const {getDB} = require('./mongodb');

module.exports = async (search, callback) => {
    try{
        const db = getDB()
        const collection = await db.collection('films')
        const cursor = await collection.find()
        let result = await cursor.toArray()
        result = result.filter(item => item.title.toLowerCase().indexOf(search.toLowerCase()) !== -1)
        if (result.length > 0){
           callback(null, result);
        }else{
           callback(null, null, notFound)
        }
        console.log("searched");
    }catch(err){
        callback(err)
        console.error(err)
    }
};
