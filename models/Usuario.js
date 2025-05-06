const { Schema, model } = require('mongoose');

const UsuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    edad: {
        type: Number,
        required: false
    },
    fecha_creacion: {
        type: Date,
        default: Date.now
    },
    direcciones: [
        {
            calle: { type: String, required: true },
            ciudad: { type: String, required: true },
            pais: { type: String, required: true },
            codigo_postal: { type: String, required: true }
        }
    ],
    rol: {
        type: String,
        required: true,
        enum: ['Administrador', 'Usuario']
    },
    fechaCreacion: {
        type: Date,
        required: true,
        default: Date.now
    },
    fechaActualizacion: {
        type: Date,
        required: true,
        default: Date.now
    }
});

module.exports = model('Usuario', UsuarioSchema);