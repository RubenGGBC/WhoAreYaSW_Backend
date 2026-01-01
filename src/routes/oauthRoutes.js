const express = require('express');
const passport = require('passport');
const router = express.Router();

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
        try {
            // Establecer variables de sesión manualmente (igual que login regular)
            if (req.user) {
                req.session.userId = req.user._id;
                req.session.userRole = req.user.role;
            }
            
            // Redirigir según rol
            if (req.user && req.user.role === 'admin') {
                res.redirect('/admin');
            } else {
                res.redirect('/');
            }
        } catch (error) {
            console.error('Error en callback de Google:', error);
            res.redirect('/login?error=oauth');
        }
    }
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
    (req, res) => {
        try {
            // Establecer variables de sesión manualmente (igual que login regular)
            if (req.user) {
                req.session.userId = req.user._id;
                req.session.userRole = req.user.role;
            }
            
            // Redirigir según rol
            if (req.user && req.user.role === 'admin') {
                res.redirect('/admin');
            } else {
                res.redirect('/');
            }
        } catch (error) {
            console.error('Error en callback de GitHub:', error);
            res.redirect('/login?error=oauth');
        }
    }
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