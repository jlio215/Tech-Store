const Producto = require('../models/Producto');
const { request, response } = require('express');

/**
 * Crear un nuevo producto
 */
const createProducto = async (req = request, res = response) => {
    try {
        const { sku } = req.body;

        const productoDB = await Producto.findOne({ sku });
        if (productoDB) {
            return res.status(400).json({ msg: 'Ya existe un producto con ese SKU' });
        }

        const producto = new Producto(req.body);
        await producto.save();

        return res.status(201).json(producto);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

/**
 * Obtener productos con paginación
 */
const getProductos = async (req = request, res = response) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;

        const [productos, total] = await Promise.all([
            Producto.find().skip(skip).limit(limit),
            Producto.countDocuments()
        ]);

        return res.json({
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            productos
        });
    } catch (error) {
        return res.status(500).json({ msg: 'Error general: ' + error.message });
    }
};

/**
 * Obtener un producto por ID
 */
const getProducto = async (req = request, res = response) => {
    try {
        const id = req.params.id;
        const producto = await Producto.findById(id);
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }
        return res.json(producto);
    } catch (error) {
        return res.status(500).json({ msg: 'Error general: ' + error.message });
    }
};

/**
 * Actualizar un producto por ID
 */
const updateProductoByID = async (req = request, res = response) => {
    try {
        const id = req.params.id;
        const data = req.body;
        data.fechaActualizacion = new Date();

        const productoActualizado = await Producto.findByIdAndUpdate(id, data, { new: true });
        if (!productoActualizado) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        return res.json(productoActualizado);
    } catch (error) {
        return res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

/**
 * Eliminar un producto
 */
const deleteProducto = async (req = request, res = response) => {
    try {
        const id = req.params.id;
        const productoEliminado = await Producto.findByIdAndDelete(id);
        if (!productoEliminado) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        return res.json({ msg: 'Producto eliminado correctamente' });
    } catch (error) {
        return res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

/**
 * Buscar productos por categoría
 */
const buscarProductosPorCategoria = async (req = request, res = response) => {
    try {
        const categoria = req.query.categoria;
        if (!categoria) {
            return res.status(400).json({ msg: 'La categoría es requerida' });
        }
        
        const productos = await Producto.find({ categoria });
        return res.json(productos);
    } catch (error) {
        return res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

module.exports = {
    createProducto,
    getProductos,
    getProducto,
    updateProductoByID,
    deleteProducto,
    buscarProductosPorCategoria
};
