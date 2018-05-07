module.exports = (isAdmin, res, films, hint) => {
    //с админскими правами
    if (isAdmin) return res.render('films_admin', {films, hint});
    //без админских прав
    res.render('films', {films, hint});
};
