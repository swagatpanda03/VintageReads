const express = require('express');
const {checkUser} = require('./middleware/authMiddleware');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.set('view engine', 'ejs');

//Database Connection
require('./database');


app.get('*', checkUser);
app.use('/', require('./routes/homeRoutes'));
app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/adminRoutes'));

app.listen(3000, ()=>{
    console.log(`App running on PORT 3000`);
});