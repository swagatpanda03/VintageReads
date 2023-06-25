const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const sellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    interest: {
        type: String,
        required: true
    }
}, { timestamps: true });

sellerSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

sellerSchema.post('save', function(doc, next){
    console.log('New User Created: ', doc);
    next();
});

const sellerModel = mongoose.model('Seller', sellerSchema);

module.exports = sellerModel;