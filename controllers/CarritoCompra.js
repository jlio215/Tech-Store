const CarritoCompra = require('../models/CarritoCompra');
const Pedido = require('../models/Pedido');
const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto'); // Asegúrate de tener este modelo
const { request, response } = require('express');

const getCarrito = async (req = request, res = response) => {
  try {
    const { _id } = req.user;
    let carrito = await CarritoCompra.findOne({ 'usuario._id': _id }).populate('items.producto');

    if (!carrito) {
      const usuario = await Usuario.findById(_id).select('nombre email');
      if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });

      carrito = new CarritoCompra({
        usuario: { _id, email: usuario.email, nombre: usuario.nombre },
        items: []
      });
      await carrito.save();
    }

    return res.json(carrito);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

const addItemCarrito = async (req = request, res = response) => {
  try {
    const { _id } = req.user;
    const { producto, cantidad } = req.body;

    const productoDB = await Producto.findById(producto);
    if (!productoDB) return res.status(404).json({ msg: 'Producto no encontrado' });

    if (cantidad > productoDB.stock) {
      return res.status(400).json({ msg: `Solo hay ${productoDB.stock} unidades disponibles` });
    }

    let carrito = await CarritoCompra.findOne({ 'usuario._id': _id });

    if (!carrito) {
      const usuario = await Usuario.findById(_id).select('nombre email');
      if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });

      carrito = new CarritoCompra({
        usuario: { _id, email: usuario.email, nombre: usuario.nombre },
        items: []
      });
    }

    const index = carrito.items.findIndex(i => i.producto.toString() === producto);

    if (index >= 0) {
      const nuevaCantidad = cantidad;
      if (nuevaCantidad > productoDB.stock) {
        return res.status(400).json({ msg: `Solo hay ${productoDB.stock} unidades disponibles` });
      }
      carrito.items[index].cantidad = nuevaCantidad;
    } else {
      carrito.items.push({ producto, cantidad });
    }

    await carrito.save();
    carrito = await carrito.populate('items.producto');

    return res.json(carrito);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

const removeItemCarrito = async (req = request, res = response) => {
  try {
    const { _id } = req.user;
    const { productoId } = req.params;

    const carrito = await CarritoCompra.findOne({ 'usuario._id': _id });
    if (!carrito) return res.status(404).json({ msg: 'Carrito no encontrado' });

    carrito.items = carrito.items.filter(i => i.producto.toString() !== productoId);
    await carrito.save();

    const result = await carrito.populate('items.producto');
    return res.json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

const clearCarrito = async (req = request, res = response) => {
  try {
    const { _id } = req.user;

    const carrito = await CarritoCompra.findOneAndUpdate(
      { 'usuario._id': _id },
      { items: [] },
      { new: true }
    ).populate('items.producto');

    if (!carrito) return res.status(404).json({ msg: 'Carrito no encontrado' });

    return res.json(carrito);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

const updateEstadoCarrito = async (req = request, res = response) => {
  try {
    const { _id } = req.user;
    const { estado, direccionEnvio, metodoPago } = req.body;

    if (!['pendiente', 'pagado'].includes(estado)) {
      return res.status(400).json({ msg: 'Estado inválido' });
    }

    let carrito = await CarritoCompra.findOne({ 'usuario._id': _id }).populate('items.producto');
    if (!carrito) return res.status(404).json({ msg: 'Carrito no encontrado' });

    // Validación de stock antes de confirmar el pago
    for (const item of carrito.items) {
      if (item.cantidad > item.producto.stock) {
        return res.status(400).json({
          msg: `No hay suficiente stock para el producto "${item.producto.nombre}". Disponible: ${item.producto.stock}`
        });
      }
    }

    carrito.estado = estado;
    await carrito.save();

    if (estado === 'pagado') {
      const usuario = await Usuario.findById(_id).select('nombre email');
      if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });

      const itemsPedido = carrito.items.map(item => ({
        producto: item.producto._id,
        cantidad: item.cantidad,
        precioUnitario: item.producto.precio
      }));

      const total = itemsPedido.reduce((sum, i) => sum + i.cantidad * i.precioUnitario, 0);

      const pedidoData = {
        usuario: { _id, email: usuario.email, nombre: usuario.nombre },
        items: itemsPedido,
        total,
        carritoCompra: carrito._id,
        direccionEnvio: direccionEnvio || 'Sin dirección especificada',
        metodoPago: metodoPago || 'tarjeta'
      };

      const pedido = new Pedido(pedidoData);
      await pedido.save();

      // Actualizar stock de productos
      for (const item of carrito.items) {
        const prod = await Producto.findById(item.producto._id);
        prod.stock -= item.cantidad;
        await prod.save();
      }

      carrito.items = [];
      await carrito.save();

      return res.status(201).json({ pedido });
    }

    return res.json(carrito);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

module.exports = {
  getCarrito,
  addItemCarrito,
  removeItemCarrito,
  clearCarrito,
  updateEstadoCarrito
};
