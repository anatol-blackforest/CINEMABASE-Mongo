const {pagination: {openPager, pages, activePage}} = require('./config');

module.exports = ({flash, isAuthenticated}, res, films, hint) => {
    let message = flash('message')[0]
    //с админскими правами
    if (isAuthenticated()) return res.render('films_admin', {films, openPager, pages, activePage, hint});
    //неудача авторизации
    if (message) return res.render('films', {films, openPager, pages, activePage, hint: message});
    //без админских прав
    res.render('films', {films, openPager, pages, activePage, hint});
};
