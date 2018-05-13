//устанавливаем админа для приложения
const {MongoClient, url} = require('./config');
const crypto = require('./crypto');
const messages = require('./messages');
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
                if (array.length !== 0) callHandler(callback, db, messages.alreadyInst);
                //если форма незаполнена
                else if (req.body && !req.body.adminname && !req.body.password) callHandler(callback, db, messages.enterLogPass)
                //Если нет логина
                else if (req.body && !req.body.adminname) callHandler(callback, db, messages.enterLogin)
                //Если нет пароля
                else if (req.body && !req.body.password) callHandler(callback, db, messages.enterPass)
                //Если пароль меньше установленной длинны
                else if (req.body && req.body.password.length <= 3) callHandler(callback, db, messages.passLength)
                //длинна пароля НЕ менее 4 символов
                else if (req.body && req.body.adminname.length > 0 && req.body.password.length > 3){
                    let adminAccount = {}
                    adminAccount.adminname = req.body.adminname;
                    adminAccount.password = await crypto(req.body.password);
                    await collection.insertOne(adminAccount)
                    callHandler(callback, db, messages.success);
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
