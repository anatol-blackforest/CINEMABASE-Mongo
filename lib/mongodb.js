//Настройки базы данных
const {MongoClient, ObjectId} = require('mongodb');
const {url} = require('./config');

module.exports = {
    MongoClient,
    ObjectId,
    url
}
