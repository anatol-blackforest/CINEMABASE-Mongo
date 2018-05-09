module.exports = (req, res, films, hint) => {
    let message = req.flash('message')[0]
    //с админскими правами
    if (req.isAuthenticated()) return res.render('films_admin', {films, hint});
    //неудача авторизации
    if (message) return res.render('films', {films, hint: message});
    //без админских прав
    res.render('films', {films, hint});
};
