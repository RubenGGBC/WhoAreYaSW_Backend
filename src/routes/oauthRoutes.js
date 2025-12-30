const express = require('express');
const passport = require('passport');
const router = express.Router();

// ===== GOOGLE OAUTH =====
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
    (req, res) => {
        // Redirigir según rol
        if (req.user && req.user.role === 'admin') {
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    }
);

// ===== GITHUB OAUTH =====
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
    (req, res) => {
        // Redirigir según rol
        if (req.user && req.user.role === 'admin') {
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    }
);

// ===== LOGOUT =====
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