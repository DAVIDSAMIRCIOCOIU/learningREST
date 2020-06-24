const express = require('express');
const app = express();
const morgan = require('morgan');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders')

app.use(morgan('dev'));
// Use routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes)

//Error handling middleware: create the error
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