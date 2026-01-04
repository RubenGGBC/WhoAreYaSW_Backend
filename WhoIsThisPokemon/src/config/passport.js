const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3001/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ providerId: profile.id, provider: 'google' });
        
        if (!user) {
            const userCount = await User.countDocuments();
            const role = userCount === 0 ? 'admin' : 'user';
            
            user = await User.create({
                name: profile.name.givenName || profile.displayName,
                lastName: profile.name.familyName || '',
                email: profile.emails[0].value,
                provider: 'google',
                providerId: profile.id,
                icon: profile.photos[0]?.value,
                role: role
            });
        }
        
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

// GitHub Strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:3001/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ providerId: profile.id, provider: 'github' });
        
        if (!user) {
            const userCount = await User.countDocuments();
            const role = userCount === 0 ? 'admin' : 'user';
            
            const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@github.local`;
            const nameParts = (profile.displayName || profile.username).split(' ');
            
            user = await User.create({
                name: nameParts[0] || profile.username,
                lastName: nameParts.slice(1).join(' ') || '',
                email: email,
                provider: 'github',
                providerId: profile.id,
                icon: profile.photos[0]?.value,
                role: role
            });
        }
        
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));

module.exports = passport;
