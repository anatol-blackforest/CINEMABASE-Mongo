//считываем админаккаунт с базы для сравнения с данными авторизации
const {MongoClient, url} = require('./config');
const crypto = require('./crypto');
let db;

module.exports = async (adminname, password, callback) => {
    try{
        password = crypto(password)
        db = await MongoClient.connect(url)
        const collection = await db.collection('admin')
        const user = await collection.findOne({adminname, password})
        console.log(user)
        db.close()
        return (user) ? callback(null, user) : callback(null, false)
    }catch(err){
        callback(null, false)
        if (db) db.close();
        console.error(err)
    }
};
