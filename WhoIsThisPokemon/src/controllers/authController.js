const User = require('../models/User');

// Registrar nuevo usuario
exports.register = async (req, res) => {
  try {
    const { name, lastName, email, password, confirmPassword } = req.body;

    // Validaciones con ifs
    const errors = [];

    if (!name) {
      errors.push('El nombre es requerido');
    } else if (name.length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    if (!lastName) {
      errors.push('El apellido es requerido');
    } else if (lastName.length < 2) {
      errors.push('El apellido debe tener al menos 2 caracteres');
    }

    if (!email) {
      errors.push('El email es requerido');
    } else if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      errors.push('Email inválido');
    }

    if (!password) {
      errors.push('La contraseña es requerida');
    } else if (password.length < 8) {
      errors.push('La contraseña debe tener al menos 8 caracteres');
    }

    if (!confirmPassword) {
      errors.push('Confirmación de contraseña requerida');
    } else if (password !== confirmPassword) {
      errors.push('Las contraseñas no coinciden');
    }

    // Si hay errores, retornarlos
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Datos de entrada inválidos',
          details: errors
        }
      });
    }

    // Verificar si el email ya existe
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

    // El primer usuario es admin, el resto son users
    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'admin' : 'user';

    // Crear nuevo usuario
    const newUser = new User({
      name,
      lastName,
      email,
      password,
      role
    });

    await newUser.save();

    // Crear sesión
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
      message: userCount === 0 ? 'Primer usuario registrado como admin' : 'Usuario registrado exitosamente'
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'REGISTRATION_ERROR',
        message: 'Error al registrar usuario'
      }
    });
  }
};

// Iniciar sesión
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones con ifs
    const errors = [];

    if (!email) {
      errors.push('El email es requerido');
    } else if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      errors.push('Email inválido');
    }

    if (!password) {
      errors.push('La contraseña es requerida');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Datos de entrada inválidos',
          details: errors
        }
      });
    }

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Email o contraseña inválidos'
        }
      });
    }

    // Comparar contraseña
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Email o contraseña inválidos'
        }
      });
    }

    // Crear sesión
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
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'LOGIN_ERROR',
        message: 'Error al iniciar sesión'
      }
    });
  }
};

// Cerrar sesión
exports.logout = (req, res) => {
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
};

// Obtener usuario actual
exports.getCurrentUser = (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'NOT_AUTHENTICATED',
        message: 'Debe iniciar sesión'
      }
    });
  }

  res.status(200).json({
    success: true,
    data: {
      userId: req.session.userId,
      role: req.session.userRole
    }
  });
};
