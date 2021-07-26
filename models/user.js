const mongoose = require('mongoose');
const Product = require('./product');
const PassportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    cart: [{
        pid: {
            type: mongoose.Schema.Types.Array,
            ref: Product
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    usertype: {
        type: String
    },
    phone: {
        type: Number,
        unique: true
    },
    name: {
        type: String
    }
})

userSchema.plugin(PassportLocalMongoose);

const User = mongoose.model('user', userSchema);

module.exports = User;