const mongoose = require('mongoose');

const artSchema = new mongoose.Schema({
    sellerid: {
        type: String
    },
    name: {
        type: String
    },
    price: {
        type: String
    },
    image: {
        type: String
    },
    description: {
        type: String
    },
    sold: {
        type: String,
        default: "0"
    }
}, {timestamps: true});

module.exports = mongoose.model('Arts', artSchema);