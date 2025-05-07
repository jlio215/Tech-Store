const { Schema, model } = require('mongoose');

const ItemPedidoSchema = new Schema({
  producto: {
    type: Schema.Types.ObjectId,
    ref: 'Producto',
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: [1, 'La cantidad mínima es 1']
  },
  precioUnitario: {
    type: Number,
    required: true,
    min: [0, 'El precio no puede ser negativo']
  }
}, { _id: false });

const UsuarioPedidoSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  email: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true
  }
}, { _id: false });

const PedidoSchema = new Schema({
  carrito: {
    type: Schema.Types.ObjectId,
    ref: 'CarritoCompra',
    required: true,
    unique: true  // cada carrito produce un solo pedido
  },
  usuario: {
    type: UsuarioPedidoSchema,
    required: true
  },
  items: {
    type: [ItemPedidoSchema],
    validate: [arr => arr.length > 0, 'Debe haber al menos un ítem en el pedido']
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'El total no puede ser negativo']
  },
  estado: {
    type: String,
    enum: ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'],
    default: 'pendiente'
  },
  direccionEnvio: {
    calle: { type: String, required: true },
    ciudad: { type: String, required: true },
    pais: { type: String, required: true },
    codigoPostal: { type: String, required: true }
  },
  metodoPago: {
    type: String,
    enum: ['tarjeta', 'paypal', 'mercadopago', 'transferencia'],
    required: true
  }
}, {
  timestamps: {
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion'
  }
});

module.exports = model('Pedido', PedidoSchema);