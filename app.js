const db = require('./lib/db');
const list = require('./lib/list');
const add = require('./lib/add');
const change = require('./lib/change');
const deleting = require('./lib/delete');
const uploader = require('./lib/uploader');

const twig = require('twig');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

let messages = ["Very big image! (must be less than 2 mb)", "Please upload image only!"];

app.set("twig options", {strict_variables: false});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Обработчик форм (на добавление и редактирование)
let editor = function(err, req, res, typeOfEdit) {
	//где typeOfEdit - тип формы (редактирование или добавление нового)
	if (err){
		list((err, films) => {
			res.render('films.twig',{films: films, hint: messages[0]});
		});
	} else {
        if (req.file && req.file.mimetype && req.file.mimetype.indexOf('image') == -1){
			list((err, films) => {
				res.render('films.twig',{films: films, hint: messages[1]});
			});
		} else {
			if(typeOfEdit == "add"){
                add(req, res, (films) => {
					res.redirect('/');
				});
			} else if (typeOfEdit == "change"){
				change(req, res,(films) => {
					res.redirect('/');
				});
			}
		}
	}
};

app.route("/")
    //рендерим список фильмов
	.get((req, res) => {
		list((err, films) => {
			res.render('films.twig',{films: films});
		});
	})
    //постим или редактируем
	.post((req, res) => {
		uploader(req, res, function (err) {
			if(Boolean(req.body.edit)){
					//если редактируем
					editor(err, req, res, "change");
			}else{
					//если добавляем новое
					editor(err, req, res, "add");
			}
		});
	});

//удаляем
app.delete("/delete/:id",(req, res) => {
	deleting(req.params.id, (err, films) => {
		res.render('films.twig',{films: films});
	});
});

// ловим 404 ошибку
app.use((req, res) => {
	res.status(404).render("404.twig");
});	

app.listen(3000);
console.log('Express server listening on port 3000');