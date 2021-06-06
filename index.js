const express = require('express');
const dotenv = require('dotenv');
const app = express();
const mongoose = require('mongoose');
dotenv.config();

app.use(express.json());
app.use(express.urlencoded(true))

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
        })

app.use('/watson', require('./routes/watson'));