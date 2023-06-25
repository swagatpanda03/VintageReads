const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Seller = require('../models/Seller');
const User = require('../models/User');
const Product = require('../models/Products');
const Art = require('../models/Art');
const Comics = require('../models/Comics');
const Order = require('../models/Order')
const maxAge = 3 * 24 * 60 * 60;

const createToken = (userId) => {
    return jwt.sign({ id: userId, userType: 'user' }, 'vintagereads', {
        expiresIn: maxAge
    });
}

const createSellerToken = (sellerId) => {
    return jwt.sign({ id: sellerId, userType: 'seller' }, 'vintagereads', {
        expiresIn: maxAge
    });
}

exports.startSelling = (req, res) => {
    const title = 'Start Selling';
    res.render('start_selling', { title });
}

exports.startSellingPost = async (req, res) => {
    const email = req.body.email;
    try {
        const regUser = await Seller.findOne({ email: email });
        if (regUser) {
            return res.status(400).json({ message: 'User already exists' });
        } else {
            const user = await Seller.create(req.body);
            const token = createSellerToken(user._id);
            res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

            res.status(201).json({ user: user._id });
        }
    } catch (err) { console.log(err); }
}
exports.seller_login = async (req, res) => {
    res.render('seller_login', { title: 'Seller Login' });
}
exports.seller_login_post = async (req, res) => {
    const { email, password } = req.body;
    console.log({ email, password });
    try {
        const seller = await Seller.findOne({ email: email });
        if (seller) {
            const auth = await bcrypt.compare(password, seller.password);
            if (auth) {
                const token = createSellerToken(seller._id);

                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                return res.status(201).json({ seller: seller });
            } else {
                throw Error('Incorrect Password');
            }
        } else {
            throw Error('Incorrect Email');
        }
    } catch (err) {
        console.log(err);
    }
}
exports.sellproducts = async (req, res) => {
    //const seller = await Seller.findOne({});
    res.render('sell_product', { uploaded: 0 });
}
exports.sellproductspost = async (req, res) => {
    const { id, name, description, price, authorname } = req.body;
    const prodName = req.body.product;
    const filename = req.file.filename;
    try {
        if (prodName === 'book') {
            const product = await Product.create({ sellerid: id, name: name, authorname: authorname, description: description, price: price, image: filename });
            
            if (product) {
                res.render('sell_product', { uploaded: 1 });
            }
        } else if (prodName == 'art') {
            const art = await Art.create({ sellerid: id, name: name, description: description, price: price, image: filename });
            if (art) {
                res.render('sell_product', { uploaded: 1});
            }
        } else if (prodName === 'comics') {
            const comics = await Comics.create({ sellerid: id, name: name, description: description, price: price, image: filename });
            if (comics) {
                res.render('sell_product', { uploaded: 1});
            }
        }

    } catch (err) {
        console.log(err);
    }
}
exports.sellerproducts = async (req, res) => {
    const id = req.params.id;
    const sellerId = await Seller.findOne({ _id: id });
    if (sellerId.interest === 'book') {
        const products = await Product.find({ sellerid: sellerId._id });
        const seller = sellerId.name;
        const count = await Product.count();
        const type = 'book';
        res.render('seller_products', { products, seller, count, type });
    } else if (sellerId.interest === 'art') {
        const products = await Art.find({ sellerid: sellerId._id });
        const seller = sellerId.name;
        const count = await Art.count();
        const type = 'art';
        res.render('seller_products', { products, seller, count, type });
    } else if (sellerId.interest === 'comics') {
        const products = await Comics.find({ sellerid: sellerId._id });
        const seller = sellerId.name;
        const count = await Art.count();
        console.log(count);
        const items = { products };
        const type = 'comics';
        res.render('seller_products', { products, seller, count, type });
    }

}
exports.myaccount = async (req, res) => {
    res.render('userlogin', { title: 'My Account' });
}

exports.myaccountPost = async (req, res) => {
    try {
        const user = await User.create(req.body);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    } catch (err) {
        res.status(400).json(err);
    }
}

exports.userlogin = async (req, res) => {
    res.render('user_login', { title: 'User Login' });
}

exports.userloginPost = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        console.log(user.name);
        if (user) {
            const auth = await bcrypt.compare(password, user.password);
            if (auth) {
                const token = createToken(user._id);
                res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
                res.status(201).json({ user: user._id });
            } else {
                throw Error('Incorrect Password');
            }
        } else {
            throw Error('Incorrect Email');
        }


    } catch (err) {
        res.status(400).json(err);
    }
}

exports.logout = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}

exports.userIndex = async (req, res) => {
    try {
        const limit = 4;
//        const products = await Product.find().limit(limit);
        const products = await Product.find({sold: "0"}).limit(limit);
        const arts = await Art.find({sold: "0"}).limit(limit);
        const comics = await Comics.find({sold: "0"}).limit(limit);
        res.render('user_index', { arts, products, comics });
    } catch (err) {
        console.log(err);
    }
}
exports.myprofile = async (req, res) => {
    const id = req.params.id;
    try {
        const userDetails = await User.findById(id);
        res.render('myprofile', { userDetails });
    } catch (err) {
        console.log(err);
    }
}
exports.myorders = async(req, res)=>{
    const id = req.params.id;
    let products = [];
    try{
        const customer = await User.findById(id);
        const orders = await Order.find({customerid: id})
        .then(async function(docs){
            const count = await Order.countDocuments({customerid: id});
            console.log(count);
            docs.forEach(function(doc){
                products.push(doc.productid);
            })
            res.render('myorder', {customer, docs});
        });
    } catch(err) {
        console.log(err);
    }
}
exports.myprofilePost = async (req, res) => {
    console.log(req.body);
}
exports.books = async (req, res) => {
    try {
        const books = await Product.find();
        res.render('books', { books });
    } catch (err) {
        console.log(err);
    }
    res.render('books');
}
exports.arts = async (req, res) => {
    try {
        const arts = await Art.find();
        res.render('arts', { arts });
    } catch (e) {
        console.log(e);
    }
}
exports.comics = async (req, res) => {
    try {
        const comics = await Comics.find();
        res.render('comics', { comics });
    } catch (e) {
        console.log(e);
    }
}
exports.product = async (req, res) => {
    const userid = req.body.userId;
    const id = req.body.productId;
    try {
        const product = await Product.findById(id);
        const user = await User.findById(userid);
        if (product && user)
            res.render('product', { product, user });
        else
            res.send('Nothing found');
    } catch (err) {
        console.log(err);
    }
}

exports.art = async (req, res) => {
    const userid = req.body.userId;
    const id = req.body.productId;
    console.log({'userid': userid, 'productid': id});
    try {
        const product = await Art.findById(id);
        const user = await User.findById(userid);
        if (product && user)
            res.render('product', { product, user });
        else
            res.send('Nothing found');
    } catch (err) {
        console.log(err);
    }
}

exports.comic = async (req, res) => {
    const userid = req.body.userId;
    const id = req.body.productId;
    try {
        const product = await Comics.findById(id);
        const user = await User.findById(userid);
        if (product && user)
            res.render('comic', { product, user });
        else
            res.send('Nothing found');
    } catch (err) {
        console.log(err);
    }
}
exports.payment = async (req, res) => {
    res.render('payment');
}

exports.paymentPost = async (req, res) => {
    const id = req.body.custId;
    const prodId = req.body.prodId;
    const prodType = req.body.prodType;
    console.log({id, prodId, prodType})
    res.render('payment', {id, prodId, prodType});
}
exports.success = async(req, res)=>{
    const id = req.body.custId;
    const prodId = req.body.prodId;
    const prodType = req.body.prodType;
    try {
        if (prodType === 'books') {
            const product = await Product.findById(prodId);
            const user = await User.findById(id);
            const sellerid = await Seller.findById(product.sellerid);
            console.log(sellerid);
            const order = await Order.create({productname: product.name, productid: product._id, image: product.image, sellername: sellerid.name, sellerid: sellerid._id, customername: user.name, customerid: user._id, price: product.price});
            // const conditions = {_id: sellerid._id};
            // const updateData = {sold: "1"};
            // const options = {new: true};

            // await Product.findOneAndUpdate(prodId, updateData, options)
            // .then(updatedUser=>{
            //     console.log(updatedUser);
            // }).catch(err=> console.log(err));
            await Product.updateOne({_id: product._id}, {$set: {sold: "1"}})
            .then(result=> console.log(result));

            console.log(order);
            res.render('success', {user: user.name,product: product.name});
        }  else if (req.body.prodType === 'comic') {
            const product = await Comics.findById(prodId);
            const user = await User.findById(id);
            const sellerid = await Seller.findById(product.sellerid);
            const order = await Order.create({productname: product.name, productid: product._id, sellername: sellerid.name, sellerid: sellerid._id, customername: user.name, customerid: user._id, price: product.price});
            
            await Comics.updateOne({_id: product._id}, {$set: {sold: "1"}})
            .then(result=> console.log(result));

            res.render('success', {user: user.name,product: product.name});
        } else {
            const product = await Art.findById(prodId);
            const user = await User.findById(id);
            const sellerid = await Seller.findById(product.sellerid);
            const order = await Order.create({productname: product.name, productid: product._id, sellername: sellerid.name, sellerid: sellerid._id, customername: user.name, customerid: user._id, price: product.price});
            await Art.updateOne({_id: product._id}, {$set: {sold: "1"}})
            .then(result=> console.log(result));
            res.render('success', {user: user.name,product: product.name});
        }
    } catch (err) {
        console.log(err);
    }
}