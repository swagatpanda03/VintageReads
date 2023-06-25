const User = require('../models/User');
const Admin = require('../models/Admin');
const Seller = require('../models/Seller');
const Queries = require('../models/Contact');
const Arts = require('../models/Art');
const Comics = require('../models/Comics');
const Books = require('../models/Products');
const Orders = require('../models/Order');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const maxAge = 3 * 24 * 60 * 60;

const createToken = (adminId) => {
    return jwt.sign({ id: adminId, userType: 'admin' }, 'vintagereads', {
        expiresIn: maxAge
    });
}


exports.dashboard = async (req, res) => {
    res.render('admin/index', { title: 'Admin Dashboard' });
}
exports.customers = async (req, res) => {
    let perPage = 15;
    let page = req.query.page || 1;

    try {
        const customers = await User.aggregate([{
            $sort: { updateAt: 1 } }])
            .skip(perPage*page-perPage)
            .limit(perPage)
            .exec();
        const count = await User.count();
        res.render('admin/customers', { title: 'Customers', customers, current: page, pages: Math.ceil(count/perPage) });
    } catch (err) {
        console.log(err);
    }
}
exports.orders = async (req, res) => {
    let perPage = 15;
    let page = req.query.page || 1;

    try {
        const orders = await Orders.aggregate([{
            $sort: {updateAt: 1}
        }])
        .skip(perPage*page-perPage)
        .limit(perPage)
        .exec();
        const count = await Orders.count();
        res.render('admin/orders', { title: 'Orders' , orders, current: page, pages: Math.ceil(count/perPage)});
    } catch(err) {
        console.log(err);
    }
}
exports.sellers = async (req, res) => {
    let perPage = 15;
    let page = req.query.page || 1;

    try {
        const customers = await Seller.aggregate([{
            $sort: { updateAt: 1 } }])
            .skip(perPage*page-perPage)
            .limit(perPage)
            .exec();
        const count = await Seller.count();
        res.render('admin/sellers', { title: 'Sellers', customers, current: page, pages: Math.ceil(count/perPage) });
    } catch (err) {
        console.log(err);
    }
}

exports.queries = async (req, res)=>{
    let perPage = 15;
    let page = req.query.page || 1;

    try {
        const customers = await Queries.aggregate([{
            $sort: { updateAt: 1 } }])
            .skip(perPage*page-perPage)
            .limit(perPage)
            .exec();
        const count = await Queries.count();
        res.render('admin/queries', { title: 'Queries', customers, current: page, pages: Math.ceil(count/perPage) });
    } catch (err) {
        console.log(err);
    }
}
exports.art = async(req, res)=>{
    let perPage = 15;
    let page = req.query.page || 1;

    try {
        const arts = await Arts.aggregate([{
            $sort: {updated: 1}
        }]).skip(perPage*page-perPage)
        .limit(perPage)
        .exec();
        const count = await Arts.count();
        res.render('admin/art', {title: 'Arts', arts, current: page, pages: Math.ceil(count/perPage)});
    } catch(err) {
        console.log(err);
    }
}
exports.book = async(req, res)=>{
    let perPage = 15;
    let page = req.query.page || 1;

    try {
        const books = await Books.aggregate([{
            $sort: {updated: 1}
        }]).skip(perPage*page-perPage)
        .limit(perPage)
        .exec();
        const count = await Books.count();
        res.render('admin/book', {title: 'Books', books, current: page, pages: Math.ceil(count/perPage)});
    } catch(err) {
        console.log(err);
    }
}
exports.comic = async(req, res)=>{
    let perPage = 15;
    let page = req.query.page || 1;

    try {
        const comics = await Comics.aggregate([{
            $sort: {updated: 1}
        }]).skip(perPage*page-perPage)
        .limit(perPage)
        .exec();
        const count = await Comics.count();
        res.render('admin/comic', {title: 'Comics', comics, current: page, pages: Math.ceil(count/perPage)});
    } catch(err) {
        console.log(err);
    }
}
exports.login = async (req, res)=>{
    res.render('admin/login');
}
exports.loginpost = async (req, res)=>{
    const {username, password} = req.body;
    const user = await Admin.findOne({username});
    if(user) {
        const auth = await bcrypt.compare(password, user.password);
        if(auth) {
            const token = createToken(user._id);
            res.cookie('jwt', token, {maxAge:maxAge*1000});
            res.status(201).json({user: user._id});
        } else {
            throw Error('Incorrect Password');
        }
    } else {
        throw Error('Wrong Email');
    }
}

exports.logout = (req, res) => {
    res.cookie('jwt_admin', '', { maxAge: 1 });
    res.redirect('/admin/login');
}