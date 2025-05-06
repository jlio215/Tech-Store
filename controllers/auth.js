const Usuario = require('../models/Usuario')
const { request, response } = require('express')
const { validationResult } = require ('express-validator')
const bycript = require ('bcryptjs')
const { generateJwt } = require('../helpers/jwt')

/**
 * Crear usuario
 */
const login =  async (req = request, res = response) => {// endpoint
    //console.log(req.body)    
    try {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({mensaje: errors.array()})
        }

        const usuarioDB = await Usuario.findOne({ email:req.body.email })

        if(!usuarioDB) {
            return res.status(400).json({mjs: 'User not found'})
        }// select * from usuario where email = ?

        const pass = bycript.compareSync(req.body.password, usuarioDB.password)

        if (!pass) {
            return res.status(400).json({mjs: 'User not found'})
        }

        const token = generateJwt(usuarioDB)

        res.json({
            _id: usuarioDB._id,
            nombre: usuarioDB.nombre,
            rol: usuarioDB.rol,
            email: usuarioDB.email,
            acces_token: token
        })

    } catch(error) {
        console.log(error)
        return res.status(500).json({msj: error})
    }
}

module.exports = { 
    login
}