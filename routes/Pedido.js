const { Router } = require("express");
const {
  createPedidoDesdeCarrito,
  getPedidos,
  getPedido,
  updatePedidoByID,
  deletePedido,
  getPedidosPorUsuario,
} = require("../controllers/Pedido.js");
const { validateJWT } = require("../middleware/validate-jwt.js");
const { validateRolAdmin } = require("../middleware/validate-rol-admin.js");

const router = Router();

// Crear pedido desde carrito pagado (usuario autenticado)
router.post("/", validateJWT, createPedidoDesdeCarrito);

// Listar todos los pedidos (solo admin)
router.get("/", validateJWT, validateRolAdmin, getPedidos);

// Listar pedidos propios
router.get("/mios", validateJWT, getPedidosPorUsuario);

// Obtener pedido por ID
router.get("/:id", validateJWT, getPedido);

// Actualizar pedido (solo admin)
router.put("/:id", validateJWT, validateRolAdmin, updatePedidoByID);

// Eliminar pedido (solo admin)
router.delete("/:id", validateJWT, validateRolAdmin, deletePedido);

module.exports = router;
