const express = require('express');
const router = express.Router();
const pokemonController = require('../controllers/pokemonController');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');
const upload = require('../config/multer');

// Rutas públicas (sin autenticación)
router.get('/pokemon', pokemonController.getPokemon);
router.get('/pokemon/:id', pokemonController.getPokemonById);

// Rutas protegidas (requieren admin)
router.post('/pokemon', isAuthenticated, isAdmin, upload.single('image'), pokemonController.createPokemon);
router.put('/pokemon/:id', isAuthenticated, isAdmin, upload.single('image'), pokemonController.updatePokemon);
router.delete('/pokemon/:id', isAuthenticated, isAdmin, pokemonController.deletePokemon);

module.exports = router;
