//Настройки базы данных
const {MongoClient, ObjectId} = require('mongodb');
const {connectDb} = require('./messages');
const {url} = require('./config');

const state = {db: null} 

exports.ObjectId = ObjectId;
//коннектимся к базе
exports.connectDB = async (req, next) => {
    try{
        if (!state.db) state.db = await MongoClient.connect(url) 
        req.db = state.db
        console.log(connectDb)
        next()
    }catch(err){
        console.log(err)
        next(err)
    }
}
//захлопываем базу
exports.closeDB = () => state.db.close()
