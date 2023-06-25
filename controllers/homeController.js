const Contact = require('../models/Contact');

exports.home = async (req, res)=>{
    res.render('home', {title: 'Homepage'});
}
exports.contact = async(req, res)=>{
    res.render('contact', {title: 'Contact Us', submitted: 0});
}
exports.contactPost = async(req, res)=>{
    try {
        const query = await Contact.create(req.body);
        console.log(query);
        res.render('contact', {title: 'Contact Us', submitted: 1});
    } catch(err) {
        console.log(err);
    }
}

exports.about = async (req, res)=>{
    res.render('aboutus', {title: 'About Us'});
}