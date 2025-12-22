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
        required:true,
        minlength:8,
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user',
    }

});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    //Usamos 10 rondas para generar el salt
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
