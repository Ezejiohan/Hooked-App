require('dotenv').config();
const express = require('express');
const cors = require('cors')
const route = require('./routes/users');
const adminRoute = require('./routes/admins');
const categoryRoute = require('./routes/categorys');
const subcategoryRoute = require('./routes/subcategories');
const levelRoute = require('./routes/levels');
const cardRoute = require('./routes/cards');

const connectDB = require('./database/database');
connectDB();

const app = express();
app.use(cors('*'))
const {notFound} = require('./middleware/not_found');
const {errorHandlerMiddleware} = require('./middleware/errorhandler');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', route);
app.use('/', adminRoute);
app.use('/', categoryRoute);
app.use('/', subcategoryRoute);
app.use('/', levelRoute);
app.use('/', cardRoute);
app.use(notFound);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 4000;

app.listen(process.env.PORT, () => {
    console.log('app is listening on PORT ' + process.env.PORT)
});