const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Seller = require('../models/Seller');
const Admin = require('../models/Admin');

const requireAuth = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'vintagereads', async (err, decodedToken) => {
            if (err) {
                res.redirect('/login');
                console.log(err.message);
            } else {
                console.log(decodedToken);
                if (decodedToken.userType === 'user') {
                    let user = await User.findById(decodedToken.id);
                    res.locals.user = user;
                } else if (decodedToken.userType === 'seller') {
                    let seller = await Seller.findById(decodedToken.id);
                    res.locals.seller = seller;
                } else if(decodedToken.userType === 'admin') {
                    let admin = await Seller.findById(decodedToken.id);
                    res.locals.admin = admin;
                }
                next();
            }
        });
    } else {
        res.redirect('/');
    }
}

const checkUser = function (req, res, next) {
    const token = req.cookies.jwt;

    if (token) {
        jwt.verify(token, 'vintagereads', async (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.local.user = null || {};
                next();
            } else {
                console.log(decodedToken);
                if (decodedToken.userType === 'user') {
                    let user = await User.findById(decodedToken.id);
                    res.locals.user = user;
                } else if(decodedToken.userType === 'seller') {
                    let seller = await Seller.findById(decodedToken.id);
                    res.locals.seller = seller;
                } else if(decodedToken.userType === 'admin') {
                    let admin = await Admin.findById(decodedToken.id);
                    res.locals.admin = admin;
                }
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser };