const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const productsRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/cart', cartRoutes);


module.exports = app;
