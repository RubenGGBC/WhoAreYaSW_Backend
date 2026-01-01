const express = require('express');
const passport = require('passport');
const router = express.Router();
const oauthController = require('../controllers/oauthController');

// Rutas públicas de OAuth

router.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account' // Forzar selección de cuenta
    })
);

router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login?error=google',
        failureMessage: true
    }),
    oauthController.oauthSuccess
);

router.get('/auth/github',
    passport.authenticate('github', {
        scope: ['user:email']
    })
);

router.get('/auth/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/login?error=github',
        failureMessage: true
    }),
    oauthController.oauthSuccess
);

router.get('/auth/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destruyendo sesión:', err);
            }
            res.clearCookie('connect.sid');
            res.redirect('/');
        });
    });
});

module.exports = router;
