const mongoose = require('mongoose');

module.exports = mongoose.connect('mongodb://localhost:27017/vintage_reads')
.then(console.log('DB Connected Successfully'))
.catch(err => console.log('DB Connection Failed, ',err));