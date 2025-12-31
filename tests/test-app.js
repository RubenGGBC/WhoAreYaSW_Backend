const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

// Config
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Session
app.use(session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: true
}));

// Cargar rutas
app.use('/api', require('../src/routes/playerRoutes'));
app.use('/api', require('../src/routes/gameRoutes'));
app.use('/admin', require('../src/routes/adminRoutes'));
app.use('/', require('../src/routes/authRoutes')); // ¡ESTAS son las rutas en raíz!

module.exports = app;