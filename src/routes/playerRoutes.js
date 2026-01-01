//playerRoutes.js
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const playerController = require('../controllers/playerController');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');
const upload = require('../config/multer');

// Middleware para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Datos de entrada inválidos',
                details: errors.array().map(err => err.msg)
            }
        });
    }
    next();
};

// Reglas de validación para crear/actualizar jugadores
const playerValidationRules = [
    body('id')
        .notEmpty().withMessage('El ID del jugador es requerido')
        .isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),
    body('name')
        .notEmpty().withMessage('El nombre es requerido')
        .trim()
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
    body('birthDate')
        .optional({ checkFalsy: true })
        .isISO8601().withMessage('Formato de fecha inválido'),
    body('nationality')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 2 }).withMessage('La nacionalidad debe tener al menos 2 caracteres'),
    body('teamId')
        .optional({ checkFalsy: true })
        .isInt({ min: 1 }).withMessage('El ID del equipo debe ser un número'),
    body('leagueId')
        .optional({ checkFalsy: true })
        .isInt({ min: 1 }).withMessage('El ID de la liga debe ser un número'),
    body('position')
        .notEmpty().withMessage('La posición es requerida')
        .isIn(['DF', 'MF', 'FW', 'GK']).withMessage('Posición inválida. Debe ser DF, MF, FW o GK'),
    body('number')
        .optional({ checkFalsy: true })
        .isInt({ min: 0, max: 99 }).withMessage('El número debe estar entre 0 y 99'),
    body('imageUrl')
        .optional({ checkFalsy: true })
        .trim()
];

// Rutas públicas (sin autenticación)
router.get('/players', playerController.getPlayers);
router.get('/players/:id', playerController.getPlayersById);
router.get('/teams', playerController.getTeams);
router.get('/leagues', playerController.getLeagues);

// Rutas protegidas (requieren admin)
router.post('/players',
    isAuthenticated,
    isAdmin,
    upload.single('image'),
    playerValidationRules,
    handleValidationErrors,
    playerController.createPlayer
);

router.put('/players/:id',
    isAuthenticated,
    isAdmin,
    upload.single('image'),
    playerValidationRules,
    handleValidationErrors,
    playerController.updatePlayer
);

router.delete('/players/:id',
    isAuthenticated,
    isAdmin,
    playerController.deletePlayer
);

module.exports = router;