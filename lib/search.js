//поиск
const {MongoClient, url} = require('./config');
const {notFound} = require('./messages');
let db;

module.exports = async (search, callback) => {
    try{
        db = await MongoClient.connect(url)
        const collection = await db.collection('films')
        const cursor = await collection.find()
        let result = await cursor.toArray()
        result = result.filter(item => item.title.toLowerCase().indexOf(search.toLowerCase()) !== -1)
        if (result.length > 0){
           callback(null, result);
        }else{
           callback(null, null, notFound)
        }
        db.close();
        console.log("searched");
    }catch(err){
        callback(err)
        if (db) db.close();
        console.error(err)
    }
};
