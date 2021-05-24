const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');



router.get('/register', async(req, res) => {
    res.render('auth/signup');
})

router.post('/register', async(req, res) => {
    try {




        const user = new User({
            email: req.body.email,
            username: `${req.body.first_name} ${req.body.last_name}`,
            phone: req.body.phone,
            usertype: req.body.type

        });
        const newUser = await User.register(user, req.body.password);
        res.redirect('/login');
        req.flash('success', 'Registered Successfully');

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

    async(req, res) => {
        req.flash('success', 'LOGGED IN SUCCESSFULLY');
        const user = await User.find({ username: req.body.username });

        module.exports.msg = user[0].username;

        if (user[0].usertype == 'customer') {
            res.redirect('/products');
        }
        if (user[0].usertype == 'retailer') {
            res.redirect('/retailer');
        }


    }

)

router.get('/logout', (req, res) => {

    req.logOut();
    req.flash('success', 'Logged Out Successfully');
    res.redirect('/login');
})

module.exports = router;