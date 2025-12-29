//playerRoutes.js
const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');
const upload = require('../config/multer');

// Rutas públicas (sin autenticación)
router.get('/players', playerController.getPlayers);
router.get('/players/:id', playerController.getPlayersById);
router.get('/teams', playerController.getTeams);
router.get('/leagues', playerController.getLeagues);

// Rutas protegidas (requieren admin)
router.post('/players', isAuthenticated, isAdmin, upload.single('image'), playerController.createPlayer);
router.put('/players/:id', isAuthenticated, isAdmin, upload.single('image'), playerController.updatePlayer);
router.delete('/players/:id', isAuthenticated, isAdmin, playerController.deletePlayer);

module.exports = router;