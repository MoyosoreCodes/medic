const express = require('express');
const dotenv = require('dotenv');
const app = express();
dotenv.config();

app.use(express.json());


app.use('/watson', require('./routes/watson'))

const port = process.env.PORT || 7000;
app.listen(port, () => {
    console.log(`listening at port ${port}`);
    console.log('connection succesful');
})
    