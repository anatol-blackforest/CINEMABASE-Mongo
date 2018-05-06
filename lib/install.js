//устанавливаем админа для приложения
const {MongoClient, url} = require('./config');
const crypto = require('./crypto');
const messages = require('./messages');

const callHandler = (callback, db, message) => {
    callback(message);
    db.close();
}

module.exports = async (req, res, type, callback) => {
    switch(type){
        case "get" : 
            callback()
            break
        case "post" : {
            const db = await MongoClient.connect(url)
            const collection = await db.collection('admin')
            // Метод find возвращает специальный объект - Cursor. Метод toArray - выдургивает из него массив с данными.
            const array = await collection.find().toArray()
            //если аккаунт уже был установлен
            if (array.length !== 0) callHandler(callback, db, messages[5]);
            //если форма незаполнена
            else if (req.body && !req.body.adminname && !req.body.password) callHandler(callback, db, messages[4])
            //Если нет логина
            else if (req.body && !req.body.adminname) callHandler(callback, db, messages[6])
            //Если нет пароля
            else if (req.body && !req.body.password) callHandler(callback, db, messages[7])
            //Если пароль меньше установленной длинны
            else if (req.body && req.body.password.length <= 3) callHandler(callback, db, messages[3])
            //длинна пароля НЕ менее 4 символов
            else if (req.body && req.body.adminname.length > 0 && req.body.password.length > 3){
                let adminAccount = {}
                adminAccount.adminname = req.body.adminname;
                adminAccount.password = await crypto(req.body.password);
                await collection.insertOne(adminAccount)
                callHandler(callback, db, messages[2]);
                console.log("added");
            }
        }
    }
};
