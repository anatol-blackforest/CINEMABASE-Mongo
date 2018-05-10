//конфигурационный файл
const config = {};
//Настройки базы данных
const mongodb = require('mongodb');
config.MongoClient = mongodb.MongoClient;
config.ObjectId = mongodb.ObjectId;
config.url = process.env.MONGOLAB_URI || "mongodb://localhost:27017/database";
//Порт
config.port = parseInt(process.env.PORT) || 3000;
//валидатор id
config.regexp = /[^a-f0-9]/
//
config.postsPerPage = 4
config.pagination = {openPager: false, pages: 0, activepage: 1}

module.exports = config;
