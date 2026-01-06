exports.handleCallback = (req, res) => {
    try {
        if (req.user) {
            if (req.user.role === 'admin') {
                return res.redirect('/admin/');
            } else {
                return res.redirect('/');
            }
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