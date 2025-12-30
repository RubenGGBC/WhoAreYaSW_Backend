const { mongoose } = require('../db/connection');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:2,
    },
    lastName:{
        type:String,
        required:true,
        minlength:2,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    },
    password:{
        type:String,
        required: function() {
            // Solo requerido si no es usuario OAuth
            return !this.isOAuthUser;
        },
        minlength:8,
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user',
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
UserSchema.pre('save', async function (next) {
    if (this.isOAuthUser || !this.isModified('password')) {
        return next();
    }

    try {
        //Usamos 10 rondas para generar el salt
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar contraseñas (solo si no es OAuth)
UserSchema.methods.comparePassword = async function(candidatePassword) {
    // Si es usuario OAuth, no hay contraseña para comparar
    if (this.isOAuthUser) {
        return false;
    }

    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        return false;
    }
};

module.exports = mongoose.model('User', UserSchema);
