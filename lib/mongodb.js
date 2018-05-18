//Настройки базы данных
const {MongoClient, ObjectId} = require('mongodb');
const {url} = require('./config');

const state = {db: null} 

exports.ObjectId = ObjectId;
exports.db = state
//коннектимся к базе
exports.connectDB = async done => {
    try{
        if (state.db) return done()
        state.db = await MongoClient.connect(url)
        done()
    }catch(err){
        done(err)
    }
}
//получаем объект базы для операций
exports.getDB = () => state.db
//захлопываем базу
exports.closeDB = done => {
    if (state.db) {
        state.db.close((err, result) => {
            state.db = null
            done(err)
        })
    }
}
