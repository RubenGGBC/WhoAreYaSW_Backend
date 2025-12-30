const { mongoose } = require('../db/connection');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
    },
    lastName: {
        type: String,
        required: function() {
            // Solo requerido si NO es usuario OAuth
            return !this.isOAuthUser;
        },
        validate: {
            validator: function(value) {
                // Si es usuario OAuth, no validamos longitud
                if (this.isOAuthUser) {
                    return true;
                }
                // Si no es OAuth, validamos mínimo 2 caracteres
                return value && value.length >= 2;
            },
            message: 'El apellido debe tener al menos 2 caracteres para usuarios locales'
        },
        default: ''
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    password: {
        type: String,
        required: function() {
            return !this.isOAuthUser;
        },
        minlength: 8,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    isOAuthUser: {
        type: Boolean,
        default: false
    },
    oauthProvider: {
        type: String,
        enum: ['google', 'github'],
        default: null
    },
    oauthId: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Middleware para hashear contraseña SOLO si no es OAuth
UserSchema.pre('save', async function(next) {
    // Solo hashear si es usuario local (no OAuth) y la contraseña fue modificada
    if (this.isOAuthUser || !this.isModified('password')) {
        // Para usuarios OAuth, no llamamos next() porque no hay que hacer nada
        return;
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
        // Si hay error, lo lanzamos para que Mongoose lo capture
        throw error;
    }
});

// Método para comparar contraseñas (UN SOLO MÉTODO)
UserSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        // Si es usuario OAuth, no tiene contraseña
        if (this.isOAuthUser) {
            return false;
        }
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        return false;
    }
};

module.exports = mongoose.model('User', UserSchema);