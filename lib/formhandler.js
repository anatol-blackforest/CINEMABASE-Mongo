//Предварительный обработчик форм (добавление или редактирование)
const list = require('./list');
const add = require('./add');
const change = require('./change');
const render = require('./render');
const {bigImage} = require('./messages');

//typeOfEdit - тип формы (редактирование или добавление нового)
module.exports = (err, req, res, typeOfEdit) => {
	//если рисунок огромен, то предупреждаем
	if (err) return list(req, (err, films) => render(req, res, films, bigImage));
	//если загруженный файл - НЕ рисунок
	if (req.file && req.file.mimetype && req.file.mimetype.indexOf('image') === -1) return list(req, (err, films) => render(req, res, films));
    //если заливка валидирована
	if (typeOfEdit === "add"){
		//при добавлении
		add(req, res, () => res.redirect('/'));
	} else if (typeOfEdit === "change"){
		//при редактировании
		change(req, res, () => res.redirect('/'));
	}
};
