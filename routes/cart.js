const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleWare');
const Product = require('../models/product');
const { findOneAndReplace } = require('../models/user');
const User = require('../models/user');

//list of products in cart
router.get('/user/:userId/cart', isLoggedIn, async(req, res) => {


    try {
        const user = await User.findById(req.params.userId).populate('cart');
        res.render('cart/cart', { userCart: user.cart });

    } catch (e) {
        req.flash('error', 'Unable to Add this product');
        res.render('error');
    }

})


//adding products to cart
router.post('/user/:id/cart', isLoggedIn, async(req, res) => {

    try {
        const product = await Product.findById(req.params.id);

        const user = req.user;
        let len = user.cart.length;
        let count = 0;
        for (let i = 0; i < len; i++) {
            if (user.cart[i].pid[0]._id == req.params.id) {
                count++;
            }

        }
        if (count == 0) {
            try {
                const prod = {
                    pid: product,
                    quantity: 1
                }
                user.cart.push(prod);
                await user.save();
                req.flash('success', 'Added to cart successfully')
                res.redirect(`/products/${req.params.id}`);
            } catch (e) {
                console.log("not added to cart");
            }

        } else {
            req.flash('error', 'Product Already Added To Cart');
            res.redirect(`/products/${req.params.id}`);
        }


    } catch (e) {
        req.flash('error', 'Unable to get the cart at this moment');
        res.render('error');
    }

});

router.delete('/user/:userid/cart/:id/:oid', async(req, res) => {

    const { userid, id, oid } = req.params;
    await User.findByIdAndUpdate(userid, { $pull: { cart: { _id: oid } } });

    res.redirect(`/user/${userid}/cart`);
})

router.get('/cart/payment', (req, res) => {
    res.render('payment/payment')
})

router.get("/user/:id/:oid/:pid/plus", async(req, res) => {
    let q;
    const user = await User.findById(req.params.id);
    for (let item of user.cart) {
        if (item._id == req.params.oid) {
            q = item.quantity;
        }
    }
    if (q < 5) {
        await User.findByIdAndUpdate(req.params.id, { $pull: { cart: { _id: req.params.oid } } });
        const product = await Product.findById(req.params.pid);
        const prod = {
            pid: product,
            quantity: q + 1
        }
        user.cart.push(prod);
        await user.save();
        res.redirect(`/user/${req.params.id}/cart`);
    } else {
        res.redirect(`/user/${req.params.id}/cart`);
    }


});

router.get("/user/:id/:oid/:pid/minus", async(req, res) => {
    let q;
    const user = await User.findById(req.params.id);
    for (let item of user.cart) {
        if (item._id == req.params.oid) {
            q = item.quantity;
        }
    }
    if (q > 1) {
        const produc = await Product.findById(req.params.pid);
        await User.findByIdAndUpdate(req.params.id, { $pull: { cart: { _id: req.params.oid } } });
        const prod = {
            pid: produc,
            quantity: q - 1
        }
        user.cart.push(prod);
        await user.save();
        res.redirect(`/user/${req.params.id}/cart`);
    } else {
        res.redirect(`/user/${req.params.id}/cart`);
    }

});


module.exports = router;