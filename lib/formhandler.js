//Предварительный обработчик форм (добавление или редактирование)
const list = require('./list');
const add = require('./add');
const change = require('./change');
const render = require('./render');

module.exports = function(err, req, res, typeOfEdit, messages, isAdmin) {
	//где typeOfEdit - тип формы (редактирование или добавление нового)
	if (err){
		list((err, films) => {
			render(isAdmin, res, films, messages[0]);
		});
	} else {
        if (req.file && req.file.mimetype && req.file.mimetype.indexOf('image') == -1){
			//если загруженный файл - НЕ рисунок
			list((err, films) => {
				render(isAdmin, res, films, messages[1]);
			});
		} else {
			if(typeOfEdit == "add"){
				//при добавлении
                add(req, res, () => {
					res.redirect('/');
				});
			} else if (typeOfEdit == "change"){
				//при редактировании
				change(req, res,() => {
					res.redirect('/');
				});
			}
		}
	}
};