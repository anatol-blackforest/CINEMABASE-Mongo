//считываем админаккаунт с базы для сравнения с данными авторизации
const {noAuth} =  require('./messages');
const crypto = require('./crypto');

module.exports = async (req, adminname, password, callback) => {
    try{
        password = crypto(password)
        const db = req.db
        const collection = await db.collection('admin')
        const user = await collection.findOne({adminname, password})
        return (user) ? callback(null, user) : callback(null, false, req.flash('message', noAuth))
    }catch(err){
        callback(null, false)
        console.error(err)
    }
};
