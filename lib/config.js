//конфигурационный файл
const config = {};
//Порт
config.port = parseInt(process.env.PORT) || 3000;
//Адрес базы
config.url = "mongodb://blackforest:2012@cluster0-shard-00-00-wuyvb.mongodb.net:27017,cluster0-shard-00-01-wuyvb.mongodb.net:27017,cluster0-shard-00-02-wuyvb.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true/database";
//валидатор id
config.regexp = /[^a-f0-9]/
//фильмов на странице
config.postsPerPage = 4
//минимальная длинна пароля при установке
config.passLength = 4
//конфигурация постраничной навигации
config.pagination = {openPager: false, pages: 0, activePage: 1}

module.exports = config;
