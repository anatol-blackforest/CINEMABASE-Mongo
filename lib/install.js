//устанавливаем админа для приложения
const {passLength} = require('./config');
const crypto = require('./crypto');
const {alreadyInst, enterLogPass, enterLogin, enterPass, passLengthHint, success, installed} = require('./messages');

module.exports = async ({db, body}, res, type, callback) => {
    try{
        switch(type){
            case "get" : 
                callback()
                break
            case "post" : {
                const db = db
                const collection = await db.collection('admin')
                // Метод find возвращает специальный объект - Cursor. Метод toArray - выдeргивает из него массив с данными.
                const array = await collection.find().toArray()
                //если аккаунт уже был установлен
                if (array.length !== 0) callback(alreadyInst);
                //если форма незаполнена
                else if (body && !body.adminname && !body.password) callback(enterLogPass)
                //Если нет логина
                else if (body && !body.adminname) callback(enterLogin)
                //Если нет пароля
                else if (body && !body.password) callback(enterPass)
                //Если пароль меньше установленной длинны
                else if (body && body.password.length < passLength) callback(passLengthHint(passLength))
                //длинна пароля НЕ менее 4 символов
                else if (body && body.adminname.length > 0 && body.password.length > 3){
                    let adminAccount = {}
                    adminAccount.adminname = body.adminname;
                    adminAccount.password = await crypto(body.password);
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
