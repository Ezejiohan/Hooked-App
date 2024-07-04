require('dotenv').config();
const express = require('express');


const connectDB = require('./database/database');
connectDB();


const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.listen(process.env.PORT, () => {
    console.log('app is listening on PORT ' + process.env.PORT)
});