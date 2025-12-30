const User = require('../models/User');

// GET - Renderizar vista de registro
exports.getRegisterView = (req, res) => {
    res.render('auth/register', {
        title: 'Registro',
        error: null
    });
};

// GET - Renderizar vista de login
exports.getLoginView = (req, res) => {
    // Obtener mensaje de error de query string si existe
    const queryError = req.query.error;
    let errorMessage = null;

    if (queryError) {
        switch(queryError) {
            case 'google':
                errorMessage = 'Error al iniciar sesión con Google. Inténtalo de nuevo.';
                break;
            case 'github':
                errorMessage = 'Error al iniciar sesión con GitHub. Inténtalo de nuevo.';
                break;
            case 'oauth':
                errorMessage = 'Error en la autenticación OAuth. Inténtalo más tarde.';
                break;
            default:
                errorMessage = 'Error en la autenticación.';
        }
    }
    res.render('auth/login', {
        title: 'Iniciar Sesión',
        error: null,
        queryError: errorMessage, // Error de OAuth desde query string
        success: req.query.success || null
    });
};

exports.register = async (req, res) => {
    try {
        const { name, lastName, email, password, confirmPassword } = req.body;

        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'PASSWORD_MISMATCH',
                    message: 'Las contraseñas no coinciden'
                }
            });
        }

        // Verificar que el email no existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'EMAIL_EXISTS',
                    message: 'El email ya está registrado'
                }
            });
        }

        // Contar usuarios para determinar si es admin, si es el primero entonces es un admin
        const userCount = await User.countDocuments();
        const role = userCount === 0 ? 'admin' : 'user';
        // Crear nuevo usuario
        const newUser = new User({ name, lastName, email, password, role });
        await newUser.save();
        req.session.userId = newUser._id;
        req.session.userRole = newUser.role;
        res.status(201).json({
            success: true,
            data: {
                id: newUser._id,
                name: newUser.name,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role
            },
            message: role === 'admin' ? 'Primer usuario registrado como admin' : 'Usuario registrado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'REGISTRATION_ERROR',
                message: error.message
            }
        });
    }

};
exports.login = async (req, res) => {
    //Obtenemos el email y la contraseña y buscamos el usuario en la DB
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user){
            return res.status(401).json({
                success: false,
                error: {
                    code: 'INVALID_CREDENTIALS',
                    message: 'Email o contraseña incorrectos'
                }
            });
        }
        //Comparamos la contraseña de ese usuario
        const CorrectPass = await user.comparePassword(password);
        if(!CorrectPass){
            return res.status(401).json({
                success: false,
                error: {
                    code: 'INVALID_CREDENTIALS',
                    message: 'Email o contraseña incorrectos'
                }
            });
        }
        //Guardamos la sesión y respondemos
        req.session.userId = user._id;
        req.session.userRole = user.role;
        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            },
            message: 'Sesión iniciada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'LOGIN_ERROR',
                message: error.message
            }
        });
    }
};
exports.logout = async (req, res) => {
    try {
        // Destruir la sesión (esto también limpia los datos de Passport)
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: {
                        code: 'LOGOUT_ERROR',
                        message: 'Error al cerrar sesión'
                    }
                });
            }
            res.clearCookie('connect.sid');
            res.status(200).json({
                success: true,
                message: 'Sesión cerrada exitosamente'
            });
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'LOGOUT_ERROR',
                message: error.message
            }
        });
    }
};
exports.getCurrentUser = async (req, res) => {
    try {
        // Verificar tanto sesión manual como Passport
        if (!req.session.userId && !req.user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'NOT_AUTHENTICATED',
                    message: 'Usuario no autenticado'
                }
            });
        }

        // Si viene de OAuth (req.user existe), usar esos datos directamente
        if (req.user) {
            return res.status(200).json({
                success: true,
                data: {
                    userId: req.user._id,
                    name: req.user.name,
                    lastName: req.user.lastName,
                    email: req.user.email,
                    role: req.user.role
                }
            });
        }

        // Si es sesión manual, obtener datos del usuario desde DB
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: {
                    code: 'USER_NOT_FOUND',
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.status(200).json({
            success: true,
            data: {
                userId: user._id,
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'GET_USER_ERROR',
                message: error.message
            }
        });
    }
};
