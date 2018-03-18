//устанавливаем админа для приложения
const {MongoClient, url} = require('./config');
const crypto = require('./crypto');
const messages = require('./messages');

const callHandler = (callback, db, message) => {
    callback(message);
    db.close();
}

module.exports = function(req, res, type, callback) {
    if (type === "get") callback();
    if (type === "post"){
        MongoClient.connect(url, (err, db) => {
            console.log(req.body)
            if (err) return console.error(err);
            // Метод find возвращает специальный объект - Cursor
            const cursor = db.collection('admin').find();
            // Метод toArray - все полученные данные преобразовывает в массив и передает в функцию обратного вызова
            cursor.toArray((err, res) => {
                //если аккаунт уже был установлен
                if (res.length !== 0) return callHandler(callback, db, messages[5]);
                //если форма незаполнена
                if (req.body && !req.body.adminname && !req.body.password) return callHandler(callback, db, messages[4]);
                //Если нет логина
                if (req.body && !req.body.adminname) return callHandler(callback, db, messages[6]);
                //Если нет пароля
                if (req.body && !req.body.password) return callHandler(callback, db, messages[7]);
                //Если пароль меньше установленной длинны
                if (req.body && req.body.password.length <= 3) return callHandler(callback, db, messages[3]);
                //длинна пароля НЕ менее 4 символов
                if (req.body && req.body.adminname.length > 0 && req.body.password.length > 3){
                    let adminAccount = {}
                    adminAccount.adminname = req.body.adminname;
                    adminAccount.password = crypto(req.body.password);
                    db.collection('admin').insertOne(adminAccount).then(() => {
                        callHandler(callback, db, messages[2]);
                        console.log("added");
                    });
                }
            });   
        }); 
    }
};
