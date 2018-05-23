//конфигурационный файл
const config = {};
//Порт
config.port = parseInt(process.env.PORT) || 3000;
//Адрес базы
config.url = process.env.MONGOLAB_URI || "mongodb+srv://blackforest:2012@cluster0-wuyvb.mongodb.net/test?retryWrites=true/database";
//валидатор id
config.regexp = /[^a-f0-9]/
//фильмов на странице
config.postsPerPage = 4
//минимальная длинна пароля при установке
config.passLength = 4
//конфигурация постраничной навигации
config.pagination = {openPager: false, pages: 0, activePage: 1}

module.exports = config;
