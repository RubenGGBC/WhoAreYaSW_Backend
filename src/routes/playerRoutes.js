//playerRoutes.js
const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');

// Rutas públicas (sin autenticación)
router.get('/players', playerController.getPlayers);
router.get('/players/:id', playerController.getPlayersById);
router.get('/teams', playerController.getTeams);
router.get('/leagues', playerController.getLeagues);

// Rutas protegidas (requieren admin)
router.post('/players', isAuthenticated, isAdmin, playerController.createPlayer);
router.put('/players/:id', isAuthenticated, isAdmin, playerController.updatePlayer);
router.delete('/players/:id', isAuthenticated, isAdmin, playerController.deletePlayer);

module.exports = router;