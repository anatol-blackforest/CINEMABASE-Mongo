//устанавливаем админа для приложения
const {MongoClient, url} = require('./config');
const crypto = require('./crypto');
const messages = require('./messages');

module.exports = function(req, res, type, callback) {

    if(type == "post"){
        MongoClient.connect(url, (err, db) => {
            if(err) return console.error(err);
            // Метод find возвращает специальный объект - Cursor
            var cursor = db.collection('admin').find();
            // Метод toArray - все полученные данные преобразовывает в массив и передает в функцию обратного вызова
            cursor.toArray((err, res) => {
                if(res.length == 0){
                    if(req.body && req.body.adminname && req.body.password){
                        if(req.body.adminname.length > 0 && req.body.password.length > 3){
                            //длинна пароля не менее 4 символов
                            let adminAccount = {}
                            adminAccount.adminname = req.body.adminname;
                            adminAccount.password = crypto(req.body.password);
                            db.collection('admin').insertOne(adminAccount).then(() => {
                                db.close();
                                callback(messages[2]);
                                console.log("added");
                            });
                        }else{
                            callback(messages[3]);
                            db.close();
                        }
                    }else{
                        callback(messages[4]);
                        db.close();
                    }
                }else{
                    callback(messages[5]);
                    db.close();
                }
            });   
        }); 
    }else{
        callback();
    }

};
