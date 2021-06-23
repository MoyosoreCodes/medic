const express = require('express');
const dotenv = require('dotenv');
const path = require('path')
const app = express();
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('./config/passport-config');
const cookieSession = require('cookie-session');
const morgan = require('morgan')

dotenv.config();

const port = process.env.PORT || 7000;
const dbUri = "mongodb://localhost:27017/medic"

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
        .then(() => {
            console.log('database connection successful');
            app.listen(port, () => {
                console.log(`connection succesful at port ${port}`);
            })
        })
        .catch(err => {
            console.log(err);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middleware
app.use(morgan('tiny'));
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000, 
    keys: 'medicuser', 
    secret: 'noonewouldknow'
}));
app.use(flash());

app.use(function(req, res, next){
    res.locals.message = req.flash('errors');
    next();
});
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

//rendering views
app.use('/', require('./routes/client/login'))
app.use('/watson', require('./routes/api/watson'));
app.use('/appointments', require('./routes/api/appointments'));