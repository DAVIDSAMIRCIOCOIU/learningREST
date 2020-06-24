const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require("body-parser");
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders')

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Set cors headers (this is only for browsers as they are the only ones to inforce the cors mechanism, postman is still able to make reqs)
app.use((req, res, next) => {
    // Adjust the response (we are not sending it but setting headers)
    res.header('Access-Control-Allow-Origin', '*');
    // Define the accepted headers sent along with the req
    res.header('Access-Control-Allow-Headers', 'Origin, X-Request-Width, Content-Type, Accept, Authorization')
    // Browser will always send an option request first before any other
    // This allows the browser if it can make specific reqs
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    // If we are not returning as above we have to call next
    next();
});

// Use routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes)

//Error handling middleware: create the error if none of the routes above match with the user url req
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    // Forward the error requests
    next(error);
});
// Catch all kind of errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;