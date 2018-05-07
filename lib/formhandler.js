//Предварительный обработчик форм (добавление или редактирование)
const list = require('./list');
const add = require('./add');
const change = require('./change');
const render = require('./render');
const messages = require('./messages');

//typeOfEdit - тип формы (редактирование или добавление нового)
module.exports = function(err, req, res, isAdmin, typeOfEdit) {
	//если рисунок огромен, то предупреждаем
	if (err) return list((err, films) => render(isAdmin, res, films, messages[0]));
	//если загруженный файл - НЕ рисунок
	if (req.file && req.file.mimetype && req.file.mimetype.indexOf('image') === -1) return list((err, films) => render(isAdmin, res, films));
    //если заливка валидирована
	if(typeOfEdit === "add"){
		//при добавлении
		add(req, res, () => res.redirect('/'));
	} else if (typeOfEdit === "change"){
		//при редактировании
		change(req, res, () => res.redirect('/'));
	}
};
