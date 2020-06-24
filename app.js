const express = require('express');
const app = express();

const productRoutes = require('./api/routes/products');

// Use routes
app.use('/products', productRoutes);

module.exports = app;