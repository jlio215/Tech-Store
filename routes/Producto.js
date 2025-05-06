const { Router } = require('express');
const {
    createProducto,
    getProductos,
    getProducto,
    updateProductoByID,
    buscarProductosPorCategoria,
    deleteProducto
} = require('../controllers/Producto.js');
const { validateJWT } = require('../middleware/validate-jwt.js');
const { validateRolAdmin } = require('../middleware/validate-rol-admin.js');

const router = Router();

/**
 * Crear producto
 */
router.post('/', validateJWT, validateRolAdmin, createProducto);

/**
 * Consultar todos los productos con paginación
 */
router.get('/', getProductos);

/** 
 *  Buscar productos por categoría
*/
router.get('/buscar', buscarProductosPorCategoria);

/**
 * Consultar un producto por su ID
 */
router.get('/:id', getProducto);

/**
 * Actualizar un producto
 */
router.put('/:id', validateJWT, validateRolAdmin, updateProductoByID);

/**
 * Eliminar un producto
 */
router.delete('/:id', validateJWT, validateRolAdmin, deleteProducto);

module.exports = router;
