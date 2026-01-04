const express = require('express');
const router = express.Router();
const pokemonGameController = require('../controllers/pokemonGameController');

// Rutas públicas (sin autenticación)
router.get('/game/current', pokemonGameController.getCurrentGameNumber);
router.get('/game/:gameNumber', pokemonGameController.getGameInfo);
router.get('/solution/:gameNumber', pokemonGameController.getSolution);

module.exports = router;
