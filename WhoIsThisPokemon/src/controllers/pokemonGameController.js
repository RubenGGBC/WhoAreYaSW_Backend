const Pokemon = require('../models/Pokemon');
const PokemonSolution = require('../models/PokemonSolution');

// Obtener el número del juego actual basado en la fecha
exports.getCurrentGameNumber = async (req, res) => {
  try {
    const SOLUTION_START_DATE = new Date(process.env.POKEMON_SOLUTION_START_DATE || '2025-01-10');
    const now = new Date();

    // Calcular días desde la fecha de inicio
    const diffTime = now - SOLUTION_START_DATE;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const gameNumber = diffDays + 1;

    res.status(200).json({
      success: true,
      data: {
        gameNumber,
        date: now
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'GAME_NUMBER_ERROR',
        message: error.message
      }
    });
  }
};

// Obtener la solución del día (pokémon del día)
// El frontend espera solo el ID del pokémon
exports.getSolution = async (req, res) => {
  try {
    const { gameNumber } = req.params;

    const solution = await PokemonSolution.findOne({ gameNumber: parseInt(gameNumber) });

    if (!solution) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'SOLUTION_NOT_FOUND',
          message: 'Solución no encontrada para este día'
        }
      });
    }

    // El frontend espera el ID del pokémon en el juego original
    const pokemon = await Pokemon.findOne({ id: solution.pokemonId });

    if (!pokemon) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'POKEMON_NOT_FOUND',
          message: 'Pokémon de la solución no encontrado'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        pokemonId: solution.pokemonId,
        _id: pokemon._id
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_SOLUTION_ERROR',
        message: error.message
      }
    });
  }
};

// Obtener información de un juego específico
exports.getGameInfo = async (req, res) => {
  try {
    const { gameNumber } = req.params;
    const SOLUTION_START_DATE = new Date(process.env.POKEMON_SOLUTION_START_DATE || '2025-01-10');

    // Calcular la fecha del juego
    const gameDate = new Date(SOLUTION_START_DATE);
    gameDate.setDate(gameDate.getDate() + (parseInt(gameNumber) - 1));

    const solution = await PokemonSolution.findOne({ gameNumber: parseInt(gameNumber) });

    const gameInfo = {
      gameNumber: parseInt(gameNumber),
      date: gameDate,
      hasSolution: !!solution
    };

    res.status(200).json({
      success: true,
      data: gameInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'GET_GAME_ERROR',
        message: error.message
      }
    });
  }
};

