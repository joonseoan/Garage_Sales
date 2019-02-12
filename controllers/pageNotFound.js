exports.pageNotFound = (req, res, next) => {
    res.status('404').render('pageNotFound', { pageTitle: '404 Error'});
}