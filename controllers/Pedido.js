const Pedido = require('../models/Pedido');
const CarritoCompra = require('../models/CarritoCompra');
const { request, response } = require('express');

/**
 * Crear un nuevo pedido desde un carrito pagado
 * Asume validateJWT deja req.user con { _id, email, nombre }
 */
const createPedidoDesdeCarrito = async (req = request, res = response) => {
  try {
    const { carritoId, direccionEnvio, metodoPago } = req.body;
    const { _id, email, nombre } = req.user;

    // Obtener carrito
    const carrito = await CarritoCompra.findById(carritoId).populate('items.producto');
    if (!carrito) {
      return res.status(404).json({ msg: 'Carrito no encontrado' });
    }
    if (carrito.estado !== 'pagado') {
      return res.status(400).json({ msg: 'El carrito debe estar en estado "pagado" para generar el pedido' });
    }

    // Construir items del pedido
    const itemsPedido = carrito.items.map(item => ({
      producto: item.producto._id,
      cantidad: item.cantidad,
      precioUnitario: item.producto.precio
    }));

    const total = itemsPedido.reduce((sum, it) => sum + it.cantidad * it.precioUnitario, 0);

    const pedido = new Pedido({
      carrito: carritoId,
      usuario: { _id, email, nombre },
      items: itemsPedido,
      total,
      direccionEnvio,
      metodoPago,
      estado: 'pagado'
    });

    await pedido.save();

    return res.status(201).json(pedido);
  } catch (error) {
    console.error(error);
    if (error.code === 11000) {
      return res.status(400).json({ msg: 'Este carrito ya ha sido convertido en pedido' });
    }
    return res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

/**
 * Listar todos los pedidos (paginado)
 */
const getPedidos = async (req = request, res = response) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const [pedidos, total] = await Promise.all([
      Pedido.find().skip(skip).limit(limit),
      Pedido.countDocuments()
    ]);

    return res.json({ total, page, limit, totalPages: Math.ceil(total / limit), pedidos });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

/**
 * Obtener un pedido por ID
 */
const getPedido = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const pedido = await Pedido.findById(id).populate('carrito');
    if (!pedido) {
      return res.status(404).json({ msg: 'Pedido no encontrado' });
    }
    return res.json(pedido);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

/**
 * Actualizar estado del pedido
 */
const updatePedidoByID = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const datos = req.body;
    const pedido = await Pedido.findByIdAndUpdate(id, datos, { new: true });
    if (!pedido) {
      return res.status(404).json({ msg: 'Pedido no encontrado' });
    }
    return res.json(pedido);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

/**
 * Eliminar un pedido
 */
const deletePedido = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const eliminado = await Pedido.findByIdAndDelete(id);
    if (!eliminado) {
      return res.status(404).json({ msg: 'Pedido no encontrado' });
    }
    return res.json({ msg: 'Pedido eliminado correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

/**
 * Listar pedidos del usuario autenticado
 */
const getPedidosPorUsuario = async (req = request, res = response) => {
  try {
    const userId = req.user._id;
    const pedidos = await Pedido.find({ 'usuario._id': userId });
    return res.json(pedidos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Error interno del servidor' });
  }
};

module.exports = {
  createPedidoDesdeCarrito,
  getPedidos,
  getPedido,
  updatePedidoByID,
  deletePedido,
  getPedidosPorUsuario
};
