const express = require('express');
const passport = require('passport');
const router = express.Router();
const oauthController = require('../controllers/oauthController');

router.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        prompt: 'select_account'
    })
);

router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login?error=google',
        failureMessage: true
    }),
    (req, res, next) => {
        console.log('Google callback - req.user:', req.user ? req.user.email : 'undefined');
        console.log('Google callback - req.session:', req.sessionID);
        next();
    },
    oauthController.handleCallback
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
    (req, res, next) => {
        console.log('GitHub callback - req.user:', req.user ? req.user.email : 'undefined');
        console.log('GitHub callback - req.session:', req.sessionID);
        next();
    },
    oauthController.handleCallback
);

router.get('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error en logout:', err);
            return res.redirect('/');
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