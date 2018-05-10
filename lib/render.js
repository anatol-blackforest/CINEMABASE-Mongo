let {pagination} = require('./config');

module.exports = (req, res, films, hint) => {
    console.log("pagination.openPager")
    let {openPager} = pagination
    let message = req.flash('message')[0]
    //с админскими правами
    if (req.isAuthenticated()) return res.render('films_admin', {films, openPager, hint});
    //неудача авторизации
    if (message) return res.render('films', {films, openPager, hint: message});
    //без админских прав
    res.render('films', {films, openPager, hint});
};
