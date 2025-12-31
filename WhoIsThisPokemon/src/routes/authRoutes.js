const express = require('express');
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rutas protegidas
router.post('/logout', isAuthenticated, authController.logout);
router.get('/me', isAuthenticated, authController.getCurrentUser);

module.exports = router;
