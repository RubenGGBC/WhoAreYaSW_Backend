const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

// Rutas para renderizar vistas (GET) - DIRECTAS
router.get('/login', authController.getLoginView);
router.get('/register', authController.getRegisterView);

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Datos de entrada inválidos',
                details: errors.array()
            }
        });
    }
    next();
};

// Rutas públicas (sin autenticación)
router.post('/register',
    [
        body('name').trim().isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
        body('lastName').trim().isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres'),
        body('email').isEmail().withMessage('Email inválido'),
        body('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
        body('confirmPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Las contraseñas no coinciden');
            }
            return true;
        })
    ],
    handleValidationErrors,
    authController.register
);

router.post('/login',
    [
        body('email').isEmail().withMessage('Email inválido'),
        body('password').exists().withMessage('La contraseña es requerida')
    ],
    handleValidationErrors,
    authController.login
);

// Rutas protegidas (requieren autenticación)
router.post('/logout', authController.logout);
router.get('/current-user', authController.getCurrentUser);
router.get('/me', isAuthenticated, authController.getCurrentUser);

module.exports = router;
