const jwt = require('jsonwebtoken');

const validateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ mensaje: 'Error unauthorized' });
  }
  try {
    const payload = jwt.verify(token, '123456');

    req.user = {
      _id: payload._id,
      email: payload.email,
      nombre: payload.nombre
    };

    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Error unauthorized' });
  }
};

module.exports = {
  validateJWT
};
