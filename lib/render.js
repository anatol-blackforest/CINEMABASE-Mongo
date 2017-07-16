module.exports = function (isAdmin, res, films, hint){
    if(isAdmin){
        //с админскими правами
        res.render('films_admin',{films, hint});
    }else{
        //без админских прав
        res.render('films',{films, hint});
    }
};

