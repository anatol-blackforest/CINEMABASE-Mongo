//поиск
const {notFound, searched} = require('./messages');

module.exports = async ({db, query:{inputSearch}}, callback) => {
    try{
        let search = inputSearch
        const collection = await db.collection('films')
        const cursor = await collection.find()
        let result = await cursor.toArray()
        result = result.filter(item => item.title.toLowerCase().indexOf(search.toLowerCase()) !== -1)
        if (result.length > 0){
           callback(null, result);
        }else{
           callback(null, null, notFound)
        }
        console.log(searched);
    }catch(err){
        callback(err)
        console.error(err)
    }
};