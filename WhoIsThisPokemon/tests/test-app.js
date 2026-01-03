const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.use(session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: true
}));

app.use('/', require('../src/routes/authRoutes'));
app.use('/api/pokemon', require('../src/routes/pokemonRoutes'));
app.use('/api/game', require('../src/routes/pokemonGameRoutes'));
app.use('/admin', require('../src/routes/adminRoutes'));

module.exports = app;
