//Настройки базы данных
const {ObjectId} = require('mongodb');
const {url} = require('./config');

module.exports = {
    ObjectId,
    url
}
