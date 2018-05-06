//подключаем модули
const {config, list, change, deleting, uploader, onefilm, search, crypto, render, install, getAccount, messages, postUploader} = require('./lib');
const port = config.port;

const twig = require('twig');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');
const path = require('path');
const logger = require('morgan');

let isAdmin;

app.set("twig options", {strict_variables: false});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({keys: ['montesuma']}));

//проверяем админский хэш в сессии
app.use((req, res, next) => {
	getAccount(result => {
		if(result && result.passHash) isAdmin = (req.session.passHash === result.passHash);
		next();
	});
});

//авторизация
app.post("/login/", (req, res) => {
	getAccount(result => {
		if(result && result.passHash && result.username && req.body.username === result.username && crypto(req.body.password) === result.passHash){
			req.session.passHash = result.passHash;
			res.redirect("/");
		}else{
			list((err, films) => render(isAdmin, res, films, messages[1]));
		}
	});
});

//выход
app.post("/logout/", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.route("/")
    //рендерим список фильмов
	.get((req, res) => list((err, films) => render(isAdmin, res, films)).catch(err => console.error(err)))
    //постим или редактируем
	.post((req, res) => {
		if(!isAdmin) return list((err, films) => render(isAdmin, res, films));
		uploader(req, res, err => {
			// место, куда файл будет загружен 
			postUploader(err, req, res, isAdmin);
		});
	});

//удаляем
app.delete("/delete/:id", (req, res) => {
	if(isAdmin) return deleting(req, (err, films) => render(isAdmin, res, films));
    list((err, films) => render(isAdmin, res, films));
});

//страница конкретного фильма
app.get("/film/:id", (req, res, next) => onefilm(req.params.id, (err, films) => {
	if(err) return next() 
	render(isAdmin, res, films)
}));

//поиск
app.get("/search/", (req, res) => search(req.query.inputSearch, (err, films) => render(isAdmin, res, films)));

//очистить поиск
app.get("/clear/", (req, res) => res.redirect("/"));

//установка приложения
app.route("/install/")
	.get((req, res) => install(req, res, "get", () => res.render("install")))
	.post((req, res) => install(req, res, "post", hint => res.render("install", {hint})).catch(err => console.error(err)));

// ловим 404 ошибку
app.use((req, res) => res.status(404).render("404.twig"));	

app.listen(port, () => console.log(`${messages[8]} ${port}`));
