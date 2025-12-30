const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const oauthRoutes = require('./routes/oauthRoutes');
const passport = require('passport');
const path = require('path');

const app = express();

// Configurar EJS como motor de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(session({
  secret: process.env.SESSION_SECRET || '9B906D89BCBA4328-8A48923B899AFC0C-83D507C9E55D4A5B-ACCEE54828089617',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/whoareya',
    ttl: 24 * 60 * 60
  })
}));

// INICIALIZAR PASSPORT
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport); // Cargar configuración

// Rutas API (primero para evitar conflictos)
app.use('/api', require('./routes/playerRoutes'));
app.use('/api', require('./routes/gameRoutes'));
// app.use('/api', require('./routes/statsRoutes'));

// Rutas de administración
app.use('/admin', adminRoutes);

// Rutas de autentificación (al final, sin prefijo)
app.use('/', authRoutes);
app.use('/', oauthRoutes);

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
