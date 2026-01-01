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

app.use('/api', require('../src/routes/playerRoutes'));
app.use('/api', require('../src/routes/gameRoutes'));
app.use('/admin', require('../src/routes/adminRoutes'));
app.use('/', require('../src/routes/authRoutes'));

module.exports = app;