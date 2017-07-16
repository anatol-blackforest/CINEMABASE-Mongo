//устанавливаем админа для приложения
const MongoClient = require('./db').mongoClient;
const ObjectId = require('./db').ObjectId;
const url = require('./db').url;
const crypto = require('./crypto');

module.exports = function(req, res, type, callback) {

    if(type == "post"){
        MongoClient.connect(url, (err, db) => {
            if(err) return console.log(err);
            // Метод find возвращает специальный объект - Cursor
            var cursor = db.collection('users').find();
            // Метод toArray - все полученные данные преобразовывает в массив и передает в функцию обратного вызова
            cursor.toArray(function(err, res){
                if(res.length == 0){
                    if(req.body && req.body.adminname && req.body.password){
                        if(req.body.adminname.length > 0 && req.body.password.length > 3){
                            //длинна пароля не менее 4 символов
                            let adminAccount = {}
                            adminAccount.adminname = req.body.adminname;
                            adminAccount.password = crypto(req.body.password);
                            db.collection('users').insertOne(adminAccount).then(() => {
                                db.close();
                                callback("Установлено!");
                                console.log("added");
                            });
                        }else{
                            callback("Пароль должен быть не менее 4 символов!");
                            db.close();
                        }
                    }else{
                        callback("Введите логин и пароль!");
                        db.close();
                    }
                }else{
                    callback("Админский аккаунт уже был установлен!");
                    db.close();
                }
            });   
        }); 
    }else{
        callback();
    }

};