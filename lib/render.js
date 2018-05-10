const {pagination} = require('./config');

module.exports = (req, res, films, hint) => {
    let {openPager, pages} = pagination
    let message = req.flash('message')[0]
    //с админскими правами
    if (req.isAuthenticated()) return res.render('films_admin', {films, openPager, pages, hint});
    //неудача авторизации
    if (message) return res.render('films', {films, openPager, pages, hint: message});
    //без админских прав
    res.render('films', {films, openPager, pages, hint});
};
