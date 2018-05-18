//добавляем фильм в базу
const {added} = require('./messages');

module.exports = async ({file, body, db}, res, callback) => {
    try{
        if(file && file.filename) body.preview = file.filename
        if(body && body.title && body.about){
            const collection = await db.collection('films')
            await collection.insertOne({...body, date: new Date().toLocaleString()})
            console.log(added)
        }
        callback()
    }catch(err){
        callback()
        console.error(err)
    }
};
