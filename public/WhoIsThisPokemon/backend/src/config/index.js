module.exports = {
  // Servidor
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Base de datos
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/pokemon',

  // Sesiones
  sessionSecret: process.env.SESSION_SECRET || 'pokemon-secret-key-change-in-production',
  sessionMaxAge: parseInt(process.env.SESSION_MAX_AGE) || 86400000,

  // Juego
  pokemonSolutionStartDate: process.env.POKEMON_SOLUTION_START_DATE || '2025-01-10',
};
