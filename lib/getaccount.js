//считываем админаккаунт с базы для сравнения с данными авторизации
const {MongoClient, url} = require('./config');
let db;

module.exports = async (callback) => {
    try{
        db = await MongoClient.connect(url)
        const collection = await db.collection('admin')
        const result = await collection.find().toArray()
        if(result && result[0] && result[0]["adminname"] && result[0]["password"]){
            callback({username:result[0]["adminname"], passHash:result[0]["password"]});
        }else{
            callback();
        };
        db.close();
        console.log("account verificated!");
    }catch(err){
        callback();
        if (db) db.close();
        console.error(err)
    }
};
