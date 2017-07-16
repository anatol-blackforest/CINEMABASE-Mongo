const db = require('./lib/db');
const list = require('./lib/list');
const add = require('./lib/add');
const change = require('./lib/change');
const deleting = require('./lib/delete');
const uploader = require('./lib/uploader');
const onefilm = require('./lib/onefilm');
const search = require('./lib/search');
const crypto = require('./lib/crypto');
const render = require('./lib/render');
const install = require('./lib/install');
const getAccount = require('./lib/getaccount');

const twig = require('twig');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');
const path = require('path');
const logger = require('morgan');

let messages = ["Very big image! (must be less than 2 mb)", "Please upload image only!", "Пожалуйста, введите верные логин и пароль"],
    isAdmin;

app.set("twig options", {strict_variables: false});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({keys: ['montesuma']}));

//проверяем админский хэш в сессии
app.use(function (req, res, next) {
	getAccount((result) => {
		if(result && result.passHash){
		    isAdmin = (req.session.passHash == result.passHash);
		}
		next();
	});
});

//авторизация
app.post("/login/", function (req, res) {
	getAccount((result) => {
		if(result && result.passHash && result.username && req.body.username == result.username && crypto(req.body.password) == result.passHash){
			req.session.passHash = result.passHash;
			res.redirect("/");
		}else{
			list((err, films) => {
				render(isAdmin, res, films, messages[2]);
			});
		}
	});
});

//выход
app.post("/logout/", function (req, res) {
    req.session = null;
    res.redirect("/");
});

//Обработчик форм (на добавление и редактирование)
let editor = function(err, req, res, typeOfEdit) {
	//где typeOfEdit - тип формы (редактирование или добавление нового)
	if (err){
		list((err, films) => {
			render(isAdmin, res, films, messages[0]);
		});
	} else {
        if (req.file && req.file.mimetype && req.file.mimetype.indexOf('image') == -1){
			list((err, films) => {
				render(isAdmin, res, films, messages[1]);
			});
		} else {
			if(typeOfEdit == "add"){
                add(req, res, () => {
					res.redirect('/');
				});
			} else if (typeOfEdit == "change"){
				change(req, res,() => {
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
			render(isAdmin, res, films, null);
		});
	})
    //постим или редактируем
	.post((req, res) => {
		if(isAdmin){
			uploader(req, res, (err) => {
				if(Boolean(req.body.edit)){
						//если редактируем
						editor(err, req, res, "change");
				}else{
						//если добавляем новое
						editor(err, req, res, "add");
				}
			});
		}else{
			list((err, films) => {
				render(isAdmin, res, films, null);
			});
        }
	});

//удаляем
app.delete("/delete/:id",(req, res) => {
	if(isAdmin){
		deleting(req, (err, films) => {
			render(isAdmin, res, films, null);
		});
	}else{
		list((err, films) => {
			render(isAdmin, res, films, null);
		});
	}
});

//страница конкретного фильма
app.get("/film/:id", (req, res) => {
	onefilm(req.params.id, (err, films) => {
		render(isAdmin, res, films, null);
	});
})

//поиск
app.get("/search/", (req, res) => {
	search(req.query.inputSearch, (err, films) => {
		render(isAdmin, res, films, null);
	});
})

//установка приложения
app.route("/install/")
	.get((req, res) => {
		install(req, res, "get", () => {
			res.render("install");
		});
	})
	.post((req, res) => {
        install(req, res, "post", (hint) => {
			res.render("install", {hint});
		});
	});

// ловим 404 ошибку
app.use((req, res) => {
	res.status(404).render("404.twig");
});	

app.listen(3000);
console.log('Express server listening on port 3000');