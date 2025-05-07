const express = require('express');
const { mongoConn } = require('./db/connect-mongo');
const dotenv = require('dotenv').config();
const cors = require('cors');

// Conexión a MongoDB
mongoConn();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*'
}));

// Rutas
const usuarioRoutes = require('./routes/Usuario.js');
const productoRoutes = require('./routes/Producto.js');
const authRoutes = require('./routes/auth.js');
const carritoRoutes = require('./routes/CarritoCompra.js');
const pedidoRoutes = require('./routes/Pedido.js');

app.use('/usuarios', usuarioRoutes);
app.use('/auth', authRoutes);
app.use('/productos', productoRoutes);
app.use('/carrito', carritoRoutes);
app.use('/pedido', pedidoRoutes);

module.exports = app;
