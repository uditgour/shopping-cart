const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const { isLoggedIn } = require('../middleWare');


router.get('/register', async(req, res) => {
    res.render('auth/signup');
})

router.post('/register', async(req, res) => {
    try {
        const user = new User({
            email: req.body.email,
            username: req.body.username,
            phone: req.body.phone,
            usertype: req.body.type,
            name: `${req.body.first_name} ${req.body.last_name}`

        });
        const newUser = await User.register(user, req.body.password);
        req.flash('success', 'Registered Successfully');
        res.redirect('/login');
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

router.get('/user/:id/info', isLoggedIn, async(req, res) => {
    let currentUser = await User.findById(req.params.id);
    res.render('profile/info', { currentUser });
})

//update name
router.patch('/user/:id/saveName', async(req, res) => {
    try {

        await User.updateOne(req.body.id, { $set: { name: req.body.first_name + " " + req.body.last_name } });
        req.flash('success', 'name updated succesfully');
        console.log("hello");
        res.redirect(`/user/${req.params.id}/info`);
    } catch (e) {
        console.log('error in updating name');

    }

});

//update email
router.patch('/user/:id/saveEmail', async(req, res) => {
    try {
        await User.updateOne(req.body.id, { $set: { email: req.body.email } });
        req.flash('success', 'Email updated succesfully');
        res.redirect(`/user/${req.params.id}/info`);
    } catch (e) {
        console.log('error in updating name');

    }

});

//update phone number
router.patch('/user/:id/savePhone', async(req, res) => {
    try {
        await User.updateOne(req.body.id, { $set: { phone: req.body.phone } });
        req.flash('success', 'Phone Number updated succesfully');
        res.redirect(`/user/${req.params.id}/info`);
    } catch (e) {
        console.log('error in updating name');

    }

});


module.exports = router;