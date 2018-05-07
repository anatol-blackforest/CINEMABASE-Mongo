//поиск
const {MongoClient, url} = require('./config');
let db;

module.exports = async (search, callback) => {
    try{
        db = await MongoClient.connect(url)
        const collection = await db.collection('films')
        const cursor = await collection.find()
        const result = await cursor.toArray()
        callback(null, result.filter(item => item.title.toLowerCase().indexOf(search.toLowerCase()) !== -1));
        db.close();
        console.log("searched");
    }catch(err){
        callback(err)
        db.close();
        console.error(err)
    }
};
