// место, куда файл будет загружен 
const path = require('path');
const fs = require('fs');
const formHandler = require('./formhandler');

//выбираем действие
const formFunc = (err, req, res, isAdmin ) => {
    //если редактируем
    if(Boolean(req.body.edit)) return formHandler(err, req, res, isAdmin, "change");
    //если добавляем новое
    formHandler(err, req, res, isAdmin, "add");
}

module.exports = function(err, req, res, isAdmin) {
    if(req.file){
        const tmp = path.join(req.file.destination, req.file.filename);
        const target = path.join('public', 'images', req.file.filename);
        const src = fs.createReadStream(tmp); 
        const dest = fs.createWriteStream(target);
        src.pipe(dest); 
        // обработка результатов загрузки 
        src.on('end', () => { 
            // удалить файл временного хранения данных
            fs.unlink(tmp); 
            formFunc(err, req, res, isAdmin)
        });
        src.on('error', err => { 
            // удалить файл временного хранения данных
            fs.unlink(tmp);  
            res.send('error'); 
        });
    }else{
        formFunc(err, req, res, isAdmin)
    }
};
