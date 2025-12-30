// Verificar que el usuario esté autenticado
exports.isAuthenticated = (req, res, next) => {
    // Verificar tanto sesión manual como Passport (OAuth)
    if (!req.session.userId && !req.user) {
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

// Verificar que el usuario sea admin
exports.isAdmin = (req, res, next) => {
    if (req.session.userRole !== 'admin') {
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
