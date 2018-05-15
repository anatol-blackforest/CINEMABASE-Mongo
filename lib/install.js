//устанавливаем админа для приложения
const {MongoClient, url, passLength} = require('./config');
const crypto = require('./crypto');
const {alreadyInst, enterLogPass, enterLogin, enterPass, passLengthHint, success} = require('./messages');
let db;

const callHandler = (callback, db, message) => {
    callback(message);
    db.close();
}

module.exports = async (req, res, type, callback) => {
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
                else if (req.body && !req.body.adminname && !req.body.password) callHandler(callback, db, enterLogPass)
                //Если нет логина
                else if (req.body && !req.body.adminname) callHandler(callback, db, enterLogin)
                //Если нет пароля
                else if (req.body && !req.body.password) callHandler(callback, db, enterPass)
                //Если пароль меньше установленной длинны
                else if (req.body && req.body.password.length < passLength) callHandler(callback, db, passLengthHint(passLength))
                //длинна пароля НЕ менее 4 символов
                else if (req.body && req.body.adminname.length > 0 && req.body.password.length > 3){
                    let adminAccount = {}
                    adminAccount.adminname = req.body.adminname;
                    adminAccount.password = await crypto(req.body.password);
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
