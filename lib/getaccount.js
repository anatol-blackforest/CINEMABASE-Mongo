//считываем админаккаунт с базы для сравнения с данными авторизации
const {MongoClient, url} = require('./config');
const {noAuth} =  require('./messages');
const crypto = require('./crypto');
let db;

module.exports = async ({flash}, adminname, password, callback) => {
    try{
        password = crypto(password)
        db = await MongoClient.connect(url)
        const collection = await db.collection('admin')
        const user = await collection.findOne({adminname, password})
        db.close()
        return (user) ? callback(null, user) : callback(null, false, flash('message', noAuth))
    }catch(err){
        callback(null, false)
        if (db) db.close();
        console.error(err)
    }
};
