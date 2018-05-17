//считываем админаккаунт с базы для сравнения с данными авторизации
const {getDB} = require('./mongodb');
const messages =  require('./messages');
const crypto = require('./crypto');

module.exports = async (req, adminname, password, callback) => {
    try{
        password = crypto(password)
        const db = getDB()
        const collection = await db.collection('admin')
        const user = await collection.findOne({adminname, password})
        return (user) ? callback(null, user) : callback(null, false, req.flash('message', messages.noAuth))
    }catch(err){
        callback(null, false)
        console.error(err)
    }
};
