const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// Rutas públicas (sin autenticación)
router.get('/game/current', gameController.getCurrentGameNumber);
router.get('/game/:gameNumber', gameController.getGameInfo);
router.get('/solution/:gameNumber', gameController.getSolution);

module.exports = router;