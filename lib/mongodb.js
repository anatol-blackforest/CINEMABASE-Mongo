//Настройки базы данных
const {MongoClient, ObjectId} = require('mongodb');
const url = process.env.MONGOLAB_URI || "mongodb://localhost:27017/database";

const state = {
    db: null,
} 

exports.ObjectId = ObjectId;
exports.db = state
//коннектимся к базе
exports.connectDB = async done => {
    try{
        if (state.db) return done()
        const db = await MongoClient.connect(url)
        state.db = db
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
            state.mode = null
            done(err)
        })
    }
}
