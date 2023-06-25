const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    query: {
        type: String,
        required: true
    }
}, {timestamps:  true});

const contactModel = mongoose.model('ContactUs', contactSchema);

module.exports = contactModel;