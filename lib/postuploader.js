// место, куда файл будет загружен 
const path = require('path');
const fs = require('fs');
const formHandler = require('./formhandler');

module.exports = function(err, req, res, isAdmin) {
    if(req.file){
        let tmp = path.join(req.file.destination, req.file.filename);
        let target = path.join('public', 'images', req.file.filename);
        let src = fs.createReadStream(tmp); 
        let dest = fs.createWriteStream(target);
        src.pipe(dest); 
        // обработка результатов загрузки 
        src.on('end', () => { 
            // удалить файл временного хранения данных
            fs.unlink(tmp); 
        });
        src.on('error', err => { 
            // удалить файл временного хранения данных
            fs.unlink(tmp);  
            res.send('error'); 
        });
    };
    if(Boolean(req.body.edit)){
        //если редактируем
        formHandler(err, req, res, isAdmin, "change");
    }else{
        //если добавляем новое
        formHandler(err, req, res, isAdmin, "add");
    };
};
