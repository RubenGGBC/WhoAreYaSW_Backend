exports.handleCallback = (req, res) => {
    try {
        if (req.user) {
            // Redirigir al admin para usuarios autenticados
            res.redirect('/admin/');
        } else {
            res.redirect('/login?error=nouser');
        }
    } catch (error) {
        console.error('Error en OAuth callback:', error);
        res.redirect('/login?error=oauth');
    }
};

exports.oauthFailure = (req, res) => {
    res.redirect('/login?error=oauth_failed');
};
