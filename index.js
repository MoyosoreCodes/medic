const express = require('express');
const dotenv = require('dotenv');
const path = require('path')
const app = express();
const mongoose = require('mongoose');
const flash = require('connect-flash');

dotenv.config();

app.use(express.json());
app.use(flash());
app.use(express.urlencoded({extended: true}));
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
app.use('/', require('./routes/client/login'))
app.use('/watson', require('./routes/api/watson'));
app.use('/appointments', require('./routes/api/appointments'));