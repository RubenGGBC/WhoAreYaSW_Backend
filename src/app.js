const express = require('express');
const path = require('path');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (frontend)
app.use(express.static(path.join(__dirname, '../public')));

// Rutas API (las crearemos en Milestone 4)
// app.use('/api', require('./routes/playerRoutes'));
// app.use('/api', require('./routes/gameRoutes'));
// app.use('/api', require('./routes/statsRoutes'));

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: err.message
    }
  });
});

module.exports = app;
