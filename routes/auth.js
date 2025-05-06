const { Router } = require('express')
const { login } = require('../controllers/auth.js')
const { check } = require ('express-validator')

const router = Router()
/**
 * Crear Usuario
 */
router.post('/', [
    check('email', 'invalid mail').isEmail(),
    check('password', 'invalid password').not().isEmpty()
],login)

module.exports = router