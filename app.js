//подключаем модули
const {config, list, page, change, deleting, uploader, onefilm, search, crypto, render, install, getAccount, messages, postUploader} = require('./lib');
const port = config.port;

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('cookie-session');
const path = require('path');
const logger = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require("connect-flash");

app.set("twig options", {strict_variables: false});
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(flash());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({keys: ['montesuma']}));
app.use(passport.initialize());
app.use(passport.session());

//проверяем админский хэш в сессии
passport.use(new LocalStrategy({passReqToCallback : true}, (req, username, password, done) => getAccount(req, username, password, done).catch(() => done(null, false))));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

//авторизация
app.post('/login', passport.authenticate('local', {successRedirect: '/', failureRedirect: '/'}))

//выход
app.post("/logout/", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.route("/")
    //рендерим список фильмов
	.get((req, res) => list((err, films) => render(req, res, films)))
    //постим или редактируем
	.post((req, res) => {
		if (!req.isAuthenticated()) return list((err, films) => render(req, res, films));
		uploader(req, res, err => {
			// место, куда файл будет загружен 
			postUploader(err, req, res);
		});
	});

//удаляем
app.delete("/delete/:id", (req, res) => {
	if (req.isAuthenticated()) return deleting(req, () => render(req, res));
    list(() => render(req, res));
});

//страница конкретного фильма
app.get("/film/:id", (req, res, next) => onefilm(req.params.id, (err, films) => {
	if (err) return next() 
	render(req, res, films)
}));

//страница списка
app.get("/page/:num", (req, res, next) => page(req.params.num, (err, films) => {
	if (err) return next() 
	render(req, res, films)
}));

//поиск
app.get("/search/", (req, res) => search(req.query.inputSearch, (err, films, hint) => render(req, res, films, hint)));

//очистить поиск
app.get("/clear/", (req, res) => res.redirect("/"));

//установка приложения
app.route("/install/")
	.get((req, res) => install(req, res, "get", () => res.render("install")))
	.post((req, res) => install(req, res, "post", hint => res.render("install", {hint})));

// ловим 404 ошибку
app.use((req, res) => res.status(404).render("404.twig"));	

app.listen(port, () => console.log(`${messages.listening} ${port}`));
