const mongoose = require('mongoose');
const Product = require('./product');
const PassportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: Product

    }],
    usertype: {
        type: String
    },
    phone: {
        type: Number
    }
})

userSchema.plugin(PassportLocalMongoose);

const User = mongoose.model('user', userSchema);

module.exports = User;