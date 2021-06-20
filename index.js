const express = require('express');
const dotenv = require('dotenv');
const path = require('path')
const app = express();
const mongoose = require('mongoose');
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const port = process.env.PORT || 7000;
const dbUri = "mongodb://localhost:27017/medic"

mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('database connection successful');
            app.listen(port, () => {
                console.log(`connection succesful at port ${port}`);
            })
        })
        .catch(err => {
            console.log(err);
        });


//rendering frontend
app.get('/', function(req, res) {
    res.render('landing', {title: "Home"});
});

app.get('/login', function(req, res) {
    res.render('login', {title: "Login"});
});


app.use('/watson', require('./routes/watson'));
app.use('/appointments', require('./routes/appointments'));