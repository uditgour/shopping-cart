const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Please Login In First');
        return res.redirect('/login');
    }
    next();
}

module.exports = { isLoggedIn };