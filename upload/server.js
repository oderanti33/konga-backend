const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('./Model/http-error');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const url = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.cwqmkab.mongodb.net/${process.env.COLLECTION_NAME}?retryWrites=true&w=majority`;

const productsRoutes = require('./Route/products-routes');
const usersRoutes = require('./Route/users-routes');


const server = express();

// server.use(express.json());

// server.use(express.urlencoded({ extended: true }));

server.use(cors({
    origin: '*',
    // You can set more options as needed
}));

server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
});

// server.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
//     res.setHeader(
//         'Access-Control-Allow-Headers',
//         'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//     );
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
//     next();
// });

server.use('/api/products', productsRoutes);
server.use('/api/users', usersRoutes);


server.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404)
    throw (error);
});

server.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error)
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'an Unknown error occur' })
});

mongoose
    .connect(url)
    .then(() => {
        server.listen(5000);
    })
    .catch(err => {
        console.log(err);
    });