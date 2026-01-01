const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');

exports.isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'NOT_AUTHENTICATED',
                    message: 'Token no proporcionado'
                }
            });
        }
        
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
        
        next();
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

exports.isAdmin = (req, res, next) => {
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
