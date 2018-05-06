//считываем фильмы с базы
const {MongoClient, url} = require('./config');

module.exports = async (callback) => {
    const db = await MongoClient.connect(url)
    const collection = await db.collection('films')
    const cursor = await collection.find()
    cursor.toArray(callback);
    db.close();
    console.log("listed");
};
