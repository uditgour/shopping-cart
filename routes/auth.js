const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const { isLoggedIn } = require('../middleWare');
let num;
let mail;

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
        mail = req.body.email;
        const us = await User.find({ username: req.body.username });
        if (us.length == 0) {
            const newUser = await User.register(user, req.body.password, function(err, user) {
                if (err) {
                    req.flash('error', 'Phone number / email id Already Registered');
                    res.redirect("/register");
                } else {
                    req.flash('success', 'Registered Successfully');
                    res.redirect('/login');
                }
            });

        } else {
            req.flash('error', 'User Name Already Taken');
            res.redirect("/register");
        }

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
        await User.findByIdAndUpdate(req.params.id, { $set: { name: req.body.first_name + " " + req.body.last_name } });
        req.flash('success', 'name updated succesfully');
        res.redirect(`/user/${req.params.id}/info`);
    } catch (e) {
        console.log('error in updating name');

    }

});

//update email
router.patch('/user/:id/saveEmail', async(req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { $set: { email: req.body.email } });
        req.flash('success', 'Email updated succesfully');
        res.redirect(`/user/${req.params.id}/info`);
    } catch (e) {
        console.log('error in updating email');

    }

});

//update phone number
router.patch('/user/:id/savePhone', async(req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { $set: { phone: req.body.phone } });
        req.flash('success', 'Phone Number updated succesfully');
        res.redirect(`/user/${req.params.id}/info`);
    } catch (e) {
        console.log('error in updating phone number');

    }

});

//change password
router.get('/mail', (req, res) => {

    res.render("auth/mail");
})

router.post('/mailValidate', async(req, res) => {
    mail = req.body.email;
    const user = await User.find({ email: req.body.email });
    if (user.length == 0) {
        req.flash('error', 'No user found with this mail id');
        res.redirect('/mail');
    } else {
        var nodemailer = require('nodemailer');
        num = Math.floor(Math.random(999) * 9999);
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'cartshopping19@gmail.com',
                pass: 'udit9981'
            }
        });

        var mailOptions = {
            from: 'cartshopping19@gmail.com',
            to: req.body.email,
            subject: 'Account Verification OTP ' + num,
            html: "<p>Hi,<br>Greetings!<br><br>You are just a step away from accessing your Shopping Cart account<br><br>We are sharing a verification code to access your account.<br><br>Once you have verified the code, you'll be prompted to set a new password immediately. This is to ensure that only you have access to your account.<br>Your OTP : <b>" + num + "</b><br><br>Best Regards,<br><br>Team Shopping Cart</p>"
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        req.flash('Success', 'Please Enter Otp');
        res.render("auth/otp");
    }
})

router.get('/otp', (req, res) => {
    res.render("auth/otp");
})

router.post('/otp', (req, res) => {
    let otp = req.body.otp;
    if (num == otp) {

        res.render('auth/reset');
    } else {
        req.flash('error', 'Invalid Otp');
        res.redirect("/otp");
    }

})

router.get('/reset', (req, res) => {
    res.render('auth/reset');
})

router.post('/reset', async(req, res) => {
    let p1 = req.body.pass1;
    let p2 = req.body.pass2;
    let u = await User.find({ email: mail });
    const user = new User({
        email: u[0].email,
        username: u[0].username,
        phone: u[0].phone,
        usertype: u[0].usertype,
        name: u[0].name,
        cart: u[0].cart

    });
    if (p1 === p2) {
        try {
            await User.findOneAndDelete({ email: mail });
            await User.register(user, p1);
            req.flash('success', 'Password Reseted Successfully . Please Login');
            res.redirect('/login');
        } catch (e) {
            req.flash('error', e.message)
        }

    } else {
        req.flash('error', 'Password does not match');
        res.redirect('/reset');
    }

});

module.exports = router;