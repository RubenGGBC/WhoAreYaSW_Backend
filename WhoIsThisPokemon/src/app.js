const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const config = require('./config');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middlewares de parseo
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Gestión de sesiones con MongoDB
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    mongoUrl: config.mongoUri,
    ttl: config.sessionMaxAge / 1000
  }),
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: config.sessionMaxAge
  }
}));

// Rutas
app.use('/auth', authRoutes);
// app.use('/api', pokemonRoutes);
// app.use('/api', pokemonGameRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Servidor Pokemon está activo'
  });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'SERVER_ERROR',
      message: err.message || 'Error interno del servidor'
    }
  });
});

module.exports = app;
