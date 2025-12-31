// Middleware para verificar que el usuario está autenticado
const isAuthenticated = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'NOT_AUTHENTICATED',
        message: 'Debe iniciar sesión'
      }
    });
  }

  next();
};

// Middleware para verificar que el usuario es admin
const isAdmin = (req, res, next) => {
  if (!req.session || !req.session.userRole || req.session.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      error: {
        code: 'FORBIDDEN',
        message: 'Acceso solo para administradores'
      }
    });
  }

  next();
};

module.exports = {
  isAuthenticated,
  isAdmin
};