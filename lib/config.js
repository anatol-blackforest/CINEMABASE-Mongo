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
//фильмов на странице
config.postsPerPage = 4
//минимальная длинна пароля при установке
config.passLength = 4
//конфигурация постраничной навигации
config.pagination = {openPager: false, pages: 0, activepage: 1}

module.exports = config;
