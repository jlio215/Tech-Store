const Usuario = require('../models/Usuario');
const { request, response } = require('express');
const bcrypt = require('bcryptjs');

/**
 * Crear usuario
 */
const createUsuario = async (req = request, res = response) => {
    try {
        const { email, password, ...rest } = req.body;

        const usuarioDB = await Usuario.findOne({ email });
        if (usuarioDB) {
            return res.status(400).json({ msg: 'Ya existe email' });
        }

        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(password, salt);

        const usuario = new Usuario({ ...rest, email, password: hashedPassword });
        await usuario.save();

        return res.status(201).json(usuario);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

/**
 * Consultar usuario con paginacion
 */
const getUsuarios = async (req = request, res = response) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const skip = (page - 1) * limit;

        const [usuarios, total] = await Promise.all([
            Usuario.find().skip(skip).limit(limit), 
            Usuario.countDocuments()                  
        ]);

        return res.json({
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            usuarios
        });
    } catch (e) {
        return res.status(500).json({ msg: 'Error general: ' + e });
    }
};

/**
 * Consultar usuario por id
 */
const getUsuario = async (req = request, res = response) => {
    try {
        const id = req.params.id;
        const usuario = await Usuario.findById(id);
        if (!usuario) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        return res.json(usuario);
    } catch (e) {
        return res.status(500).json({ msg: 'Error general: ' + e });
    }
};

/**
 * Actualizar usuario
 */
const updateUsuarioByID = async (req = request, res = response) => {
    try {
        const { password, ...data } = req.body;
        const id = req.params.id;

        if (password) {
            const salt = bcrypt.genSaltSync();
            data.password = bcrypt.hashSync(password, salt);
        }

        data.fechaActualizacion = new Date();
        const usuarioActualizado = await Usuario.findByIdAndUpdate(id, data, { new: true });

        if (!usuarioActualizado) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        return res.status(200).json(usuarioActualizado);
    } catch (e) {
        console.log(e);
        return res.status(500).json({ msg: 'Error interno del servidor' });
    }
};

/**
 * Eliminar usuario
 */
const deleteUsuario = async (req = request, res = response) => {
    try {
        const id = req.params.id;
        const usuarioEliminado = await Usuario.findByIdAndDelete(id);

        if (!usuarioEliminado) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        return res.json({ msg: 'Usuario eliminado correctamente' });
    } catch (e) {
        return res.status(500).json({ msg: 'Error general: ' + e });
    }
};

/**
 * Consulta usuario por ciudad
 */
const buscarUsuariosPorCiudad = async (req = request, res = response) => {
    try {
        const ciudad = req.query.ciudad;
        if (!ciudad) {
            return res.status(400).json({ msg: 'La ciudad es requerida' });
        }

        const usuarios = await Usuario.find({ "direcciones.ciudad": ciudad });

        return res.json(usuarios);
    } catch (e) {
        console.error("Error en buscarUsuariosPorCiudad:", e);
        return res.status(500).json({ msg: 'Error general: ' + e.message });
    }
};


module.exports = {
    createUsuario,
    getUsuarios,
    getUsuario,
    updateUsuarioByID,
    deleteUsuario,
    buscarUsuariosPorCiudad
};
