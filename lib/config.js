//конфигурационный файл
const config = {};
//Настройки базы данных
const mongodb = require('mongodb');
config.MongoClient = mongodb.MongoClient;
config.ObjectId = mongodb.ObjectId;
config.url = "mongodb://localhost:27017/database";
//Порт
config.port = 3000;
//валидатор id
config.regexp = /[^a-f0-9]/

module.exports = config;
