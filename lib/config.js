//Настройки базы данных
const mongodb = require('mongodb');
exports.mongoClient = mongodb.MongoClient;
exports.ObjectId = mongodb.ObjectId;
exports.url = "mongodb://localhost:27017/database";
//Порт
exports.port = 3000;