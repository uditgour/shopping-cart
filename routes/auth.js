const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');



router.get('/register', async(req, res) => {
    res.render('auth/signup');
})

router.post('/register', async(req, res) => {
    try {
        const user = new User({ email: req.body.email, username: req.body.username });
        const newUser = await User.register(user, req.body.password);
        req.flash('success', 'Registered Successfully');
        res.redirect('/products');
    } catch (e) {
        req.flash('error', e.message)
    }
})

router.get('/login', async(req, res) => {
    res.render('auth/login');
})

router.post('/login',
    passport.authenticate('local', {
        //successRedirect: '/products',
        failureRedirect: '/login',
        failureFlash: true
    }),

    (req, res) => {
        req.flash('success', 'LOGGED IN SUCCESSFULLY');
        res.redirect('/products');
    }

)

router.get('/logout', (req, res) => {

    req.logOut();
    req.flash('success', 'Logged Out Successfully');
    res.redirect('/login');
})

module.exports = router;