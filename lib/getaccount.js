//считываем админаккаунт с базы для сравнения с данными авторизации

const MongoClient = require('./db').mongoClient;
const url = require('./db').url;

module.exports = function (callback) {
	MongoClient.connect(url, (err, db) => {
		if(err) return console.log(err);
		db.collection('users').find().toArray((err, res)=> {
                  if(err) return console.log(err);
                  if(res && res[0] && res[0]["adminname"] && res[0]["password"]){
                      callback({username:res[0]["adminname"], passHash:res[0]["password"]});
                  }else{
                      callback();
                  };
                  db.close();
		});
	}); 
};