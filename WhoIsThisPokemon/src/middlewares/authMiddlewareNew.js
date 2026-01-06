const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');

// Middleware para vistas que necesitan autenticación (renderiza páginas)
exports.isAuthenticatedView = async (req, res, next) => {
    try {
        // Intentar con Passport primero (OAuth)
        if (req.user) {
            req.userId = req.user._id;
            req.userRole = req.user.role;
            return next();
        }

        // Intentar con sesión (login manual)
        if (req.session && req.session.userId) {
            const user = await User.findById(req.session.userId);
            if (user) {
                req.user = user;
                req.userId = user._id;
                req.userRole = user.role;
                return next();
            }
        }

        // Si no hay sesión, intentar con JWT del header
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const decoded = verifyAccessToken(token);
            
            const user = await User.findById(decoded.userId);
            if (user) {
                req.user = user;
                req.userId = user._id;
                req.userRole = user.role;
                return next();
            }
        }
        
        // No hay autenticación válida - redirigir al login
        return res.redirect('/login?error=auth_required');
    } catch (error) {
        console.error('Error en isAuthenticatedView:', error);
        return res.redirect('/login?error=session_expired');
    }
};

// Middleware para API que necesita autenticación (devuelve JSON)
exports.isAuthenticatedAPI = async (req, res, next) => {
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
        
        // Si no hay token JWT, intentar con sesión de Passport (OAuth)
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

// Middleware para verificar que es admin (para vistas)
exports.isAdminView = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).send('Acceso denegado. Solo administradores.');
    }
    next();
};

// Middleware para verificar que es admin (para API)
exports.isAdminAPI = (req, res, next) => {
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
