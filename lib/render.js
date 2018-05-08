module.exports = (req, res, films, hint) => {
    //с админскими правами
    if (req.isAuthenticated()) return res.render('films_admin', {films, hint});
    //без админских прав
    res.render('films', {films, hint});
};
