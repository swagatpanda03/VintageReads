const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    productname: {
        type: String
    },
    productid: {
        type: String
    },
    sellername: {
        type: String
    },
    sellerid: {
        type: String
    },
    customername: {
        type: String
    },
    customerid: {
        type: String
    },
    price: {
        type: String
    },
    image: {
        type: String
    }
});

module.exports = mongoose.model('Order', orderSchema);
