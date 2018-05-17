//устанавливаем админа для приложения
const {passLength} = require('./config');
const {getDB} = require('./mongodb');
const crypto = require('./crypto');
const {alreadyInst, enterLogPass, enterLogin, enterPass, passLengthHint, success, installed} = require('./messages');

module.exports = async (req, res, type, callback) => {
    try{
        switch(type){
            case "get" : 
                callback()
                break
            case "post" : {
                const db = getDB()
                const collection = await db.collection('admin')
                // Метод find возвращает специальный объект - Cursor. Метод toArray - выдeргивает из него массив с данными.
                const array = await collection.find().toArray()
                //если аккаунт уже был установлен
                if (array.length !== 0) callback(alreadyInst);
                //если форма незаполнена
                else if (req.body && !req.body.adminname && !req.body.password) callback(enterLogPass)
                //Если нет логина
                else if (req.body && !req.body.adminname) callback(enterLogin)
                //Если нет пароля
                else if (req.body && !req.body.password) callback(enterPass)
                //Если пароль меньше установленной длинны
                else if (req.body && req.body.password.length < passLength) callback(passLengthHint(passLength))
                //длинна пароля НЕ менее 4 символов
                else if (req.body && req.body.adminname.length > 0 && req.body.password.length > 3){
                    let adminAccount = {}
                    adminAccount.adminname = req.body.adminname;
                    adminAccount.password = await crypto(req.body.password);
                    await collection.insertOne(adminAccount)
                    callback(success);
                    console.log(installed);
                }
            }
        }
    }catch(err){
        callback(err);
        console.error(err)
    }
};
