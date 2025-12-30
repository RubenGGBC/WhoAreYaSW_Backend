const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

module.exports = function(passport) {
    // Serializar usuario (guardar ID en sesión)
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // Deserializar usuario (obtener usuario desde ID en sesión)
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });

    // Estrategia Google
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log('Google profile recibido:', profile.id);

            // Buscar usuario por email
            const email = profile.emails[0].value;
            let user = await User.findOne({ email });

            if (!user) {
                // Crear nuevo usuario
                // Contar usuarios para determinar rol
                const userCount = await User.countDocuments();
                const role = userCount === 0 ? 'admin' : 'user';

                user = new User({
                    name: profile.name.givenName,
                    lastName: profile.name.familyName || '',
                    email: email,
                    password: 'oauth-provided-' + Date.now(), // Contraseña ficticia única
                    role: role,
                    isOAuthUser: true
                });
                await user.save();
                console.log('Nuevo usuario OAuth creado:', email);
            }

            done(null, user);
        } catch (err) {
            console.error('Error en Google Strategy:', err);
            done(err, null);
        }
    }));

    // Estrategia GitHub
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        scope: ['user:email'] // Pedir acceso al email
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log('GitHub profile recibido:', profile.username);

            // GitHub puede no devolver email público
            let email;
            if (profile.emails && profile.emails.length > 0) {
                email = profile.emails[0].value;
            } else {
                email = `${profile.username}@github.com`;
            }

            let user = await User.findOne({ email });

            if (!user) {
                const userCount = await User.countDocuments();
                const role = userCount === 0 ? 'admin' : 'user';

                user = new User({
                    name: profile.displayName || profile.username,
                    lastName: '',
                    email: email,
                    password: 'oauth-provided-' + Date.now(),
                    role: role,
                    isOAuthUser: true
                });
                await user.save();
                console.log('Nuevo usuario GitHub creado:', email);
            }

            done(null, user);
        } catch (err) {
            console.error('Error en GitHub Strategy:', err);
            done(err, null);
        }
    }));
};