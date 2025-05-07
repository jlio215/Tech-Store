// routes/carrito.js
const { Router } = require('express');
const {
  getCarrito,
  addItemCarrito,
  removeItemCarrito,
  clearCarrito,
  updateEstadoCarrito
} = require('../controllers/CarritoCompra.js');
const { validateJWT } = require('../middleware/validate-jwt.js');

const router = Router();

/**
 * Obtener o inicializar carrito del usuario
 */
router.get('/', validateJWT, getCarrito);

/**
 * Agregar o actualizar ítem en el carrito
 * body: { producto: "<productoId>", cantidad: <número> }
 */
router.post('/', validateJWT, addItemCarrito);

/**
 * Eliminar un ítem del carrito
 */
router.delete('/:productoId', validateJWT, removeItemCarrito);

/**
 * Vaciar el carrito
 */
router.delete('/', validateJWT, clearCarrito);

/**
 * Actualizar el estado del carrito (pendiente | pagado)
 * body: { estado: 'pendiente' | 'pagado' }
 */
router.patch('/estado', validateJWT, updateEstadoCarrito);

module.exports = router;
