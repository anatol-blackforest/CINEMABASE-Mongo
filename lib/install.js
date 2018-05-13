//устанавливаем админа для приложения
const {MongoClient, url} = require('./config');
const crypto = require('./crypto');
const {alreadyInst, enterLogPass, enterLogin, enterPass, passLength, success} = require('./messages');
let db;

const callHandler = (callback, db, message) => {
    callback(message);
    db.close();
}

module.exports = async ({body}, res, type, callback) => {
    try{
        switch(type){
            case "get" : 
                callback()
                break
            case "post" : {
                db = await MongoClient.connect(url)
                const collection = await db.collection('admin')
                // Метод find возвращает специальный объект - Cursor. Метод toArray - выдeргивает из него массив с данными.
                const array = await collection.find().toArray()
                //если аккаунт уже был установлен
                if (array.length !== 0) callHandler(callback, db, alreadyInst);
                //если форма незаполнена
                else if (body && !body.adminname && !body.password) callHandler(callback, db, enterLogPass)
                //Если нет логина
                else if (body && !body.adminname) callHandler(callback, db, enterLogin)
                //Если нет пароля
                else if (body && !body.password) callHandler(callback, db, enterPass)
                //Если пароль меньше установленной длинны
                else if (body && body.password.length <= 3) callHandler(callback, db, passLength)
                //длинна пароля НЕ менее 4 символов
                else if (body && body.adminname.length > 0 && body.password.length > 3){
                    let adminAccount = {}
                    adminAccount.adminname = body.adminname;
                    adminAccount.password = await crypto(body.password);
                    await collection.insertOne(adminAccount)
                    callHandler(callback, db, success);
                    console.log("added");
                }
            }
        }
    }catch(err){
        callback(err);
        if (db) db.close();
        console.error(err)
    }
};
