//считываем админаккаунт с базы для сравнения с данными авторизации
const {MongoClient, url} = require('./config');
const crypto = require('./crypto');
let db;

module.exports = async (username, password, callback) => {
    try{
        db = await MongoClient.connect(url)
        const collection = await db.collection('admin')
        const result = await collection.find().toArray()
        db.close();
        password = crypto(password)
        if(result && result[0] && result[0]["adminname"] && result[0]["password"] && result[0]["adminname"] === username && result[0]["password"] === password){
            return true
        }else{
            return false
        }
    }catch(err){
        callback(null, false)
        if (db) db.close();
        console.error(err)
    }
};
