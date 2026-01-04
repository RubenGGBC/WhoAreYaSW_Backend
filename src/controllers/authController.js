const User = require('../models/User');
const { generateAccessToken } = require('../utils/jwt');

exports.getRegisterView = (req, res) => {
    res.render('auth/register', {
        title: 'Registro',
        error: null
    });
};

exports.getLoginView = (req, res) => {
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
        queryError: errorMessage,
        success: req.query.success || null
    });
};

exports.register = async (req, res) => {
    try {
        const { name, lastName, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'PASSWORD_MISMATCH',
                    message: 'Las contraseñas no coinciden'
                }
            });
        }

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

        const userCount = await User.countDocuments();
        const role = userCount === 0 ? 'admin' : 'user';
        
        const newUser = new User({ name, lastName, email, password, role });
        await newUser.save();
        
        const token = generateAccessToken({
            userId: newUser._id,
            email: newUser.email,
            role: newUser.role
        });
        
        // Guardar token en cookie y sesión
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 horas
        });
        
        req.session.userId = newUser._id;
        req.session.user = {
            id: newUser._id,
            name: newUser.name,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role
        };
        

        res.status(201).json({
            success: true,
            data: {
                token,
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    lastName: newUser.lastName,
                    email: newUser.email,
                    role: newUser.role
                }
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
        
        const token = generateAccessToken({
            userId: user._id,
            email: user.email,
            role: user.role
        });
        
        res.status(200).json({
            success: true,
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role
                }
            },
            message: 'Login exitoso'
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
        // Si hay token JWT, simplemente responder éxito (el cliente borra el token)
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return res.status(200).json({
                success: true,
                message: 'Sesión cerrada exitosamente'
            });
        }
        
        // Si hay sesión de Passport, destruirla
        if (req.session) {
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
                return res.status(200).json({
                    success: true,
                    message: 'Sesión cerrada exitosamente'
                });
            });
        } else {
            // Sin sesión ni token, responder éxito de todas formas
            return res.status(200).json({
                success: true,
                message: 'Sesión cerrada exitosamente'
            });
        }
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
        // Verificar JWT token primero
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            try {
                const { verifyAccessToken } = require('../utils/jwt');
                const decoded = verifyAccessToken(token);
                
                const user = await User.findById(decoded.userId);
                if (user) {
                    return res.status(200).json({
                        success: true,
                        data: {
                            userId: user._id,
                            name: user.name,
                            lastName: user.lastName,
                            email: user.email,
                            role: user.role
                        }
                    });
                }
            } catch (tokenError) {
                // Token inválido o expirado, continuar con sesión
            }
        }
        
        // Verificar sesión de Passport (OAuth)
        if (req.session.userId && req.user) {
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
        
        // Si hay usuario en sesión pero no userId
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

        // No hay autenticación válida
        return res.status(401).json({
            success: false,
            error: {
                code: 'NOT_AUTHENTICATED',
                message: 'Usuario no autenticado'
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
