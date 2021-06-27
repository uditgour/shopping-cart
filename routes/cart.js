const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleWare');
const Product = require('../models/product');
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

        user.cart.push(product);

        await user.save();
        req.flash('success', 'Added to cart successfully')
        res.redirect(`/products/${req.params.id}`);
    } catch (e) {
        req.flash('error', 'Unable to get the cart at this moment');
        res.render('error');
    }
});

router.delete('/user/:userid/cart/:id', async(req, res) => {

    const { userid, id } = req.params;
    await User.findByIdAndUpdate(userid, { $pull: { cart: id } })
    res.redirect(`/user/${req.user._id}/cart`);
})

router.get('/cart/payment', (req, res) => {
    res.render('payment/payment')
})


module.exports = router;