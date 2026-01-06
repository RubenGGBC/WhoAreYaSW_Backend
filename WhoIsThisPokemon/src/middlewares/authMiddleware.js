const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');

// Middleware para verificar que el usuario está autenticado
const isAuthenticated = async (req, res, next) => {
    try {
        // Primero intentar con JWT token
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const decoded = verifyAccessToken(token);
            
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: {
                        code: 'USER_NOT_FOUND',
                        message: 'Usuario no encontrado'
                    }
                });
            }
            
            req.user = user;
            req.userId = user._id;
            req.userRole = user.role;
            
            return next();
        }
        
        // Intentar con Passport (req.user se carga si hay sesión válida)
        if (req.user) {
            req.userId = req.user._id;
            req.userRole = req.user.role;
            return next();
        }
        
        // Intentar con sesión manual (login sin OAuth)
        if (req.session && req.session.userId) {
            req.userId = req.session.userId;
            req.userRole = req.session.userRole;
            return next();
        }
        
        // Ninguna forma de autenticación válida
        return res.status(401).json({
            success: false,
            error: {
                code: 'NOT_AUTHENTICATED',
                message: 'Token no proporcionado'
            }
        });
    } catch (error) {
        if (error.message === 'TOKEN_EXPIRED') {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'TOKEN_EXPIRED',
                    message: 'Token expirado'
                }
            });
        }
        
        return res.status(401).json({
            success: false,
            error: {
                code: 'INVALID_TOKEN',
                message: 'Token inválido'
            }
        });
    }
};

// Middleware para verificar que el usuario es admin
const isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
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