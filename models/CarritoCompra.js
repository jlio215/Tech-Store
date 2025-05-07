const { Schema, model } = require('mongoose');

// Subschema para embebir datos clave del usuario
const UsuarioCarritoSchema = new Schema({
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

const ItemCarritoSchema = new Schema({
  producto: {
    type: Schema.Types.ObjectId,
    ref: 'Producto',
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: [1, 'La cantidad mínima es 1'],
    default: 1
  }
}, { _id: false });

const CarritoCompraSchema = new Schema({
  usuario: {
    type: UsuarioCarritoSchema,
    required: true
  },
  items: {
    type: [ItemCarritoSchema],
    default: []
  },
  estado: {
    type: String,
    enum: ['pendiente', 'pagado'],
    default: 'pendiente'
  }
}, {
  timestamps: {
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion'
  }
});

module.exports = model('CarritoCompra', CarritoCompraSchema);
