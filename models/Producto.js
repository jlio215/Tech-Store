const { Schema, model } = require('mongoose');

const ProductoSchema = new Schema({
    sku: {
        type: String,
        required: [true, 'El SKU es requerido'],
        unique: true,
        trim: true
    },
    nombre: {
        type: String,
        required: [true, 'El nombre del producto es requerido'],
        trim: true
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    precio: {
        type: Number,
        required: [true, 'El precio es requerido'],
        min: [0, 'El precio no puede ser negativo']
    },
    stock: {
        type: Number,
        required: [true, 'El stock es requerido'],
        min: [0, 'El stock no puede ser negativo'],
    },
    categoria: {
        type: String,
        required: [true, 'La categoría es requerida'],
        trim: true
    },
    imagen: {
        type: String, 
        required: false
    },
    disponible: {
        type: Boolean,
        default: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now,
        required: true
    },
    fechaActualizacion: {
        type: Date,
        default: Date.now,
        required: true
    }
}, {
    timestamps: {
        createdAt: 'fechaCreacion',
        updatedAt: 'fechaActualizacion'
    }
});

module.exports = model('Producto', ProductoSchema);
