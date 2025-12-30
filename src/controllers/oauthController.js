exports.oauthSuccess = (req, res) => {
    try {
        // Guardar info de usuario en sesión (como ya lo hace passport)
        // Redirigir según rol
        if (req.user.role === 'admin') {
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    } catch (error) {
        console.error('Error en OAuth success:', error);
        res.redirect('/login?error=oauth');
    }
};

exports.oauthFailure = (req, res) => {
    res.redirect('/login?error=oauth_failed');
};