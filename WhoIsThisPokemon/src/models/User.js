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
        required:false,
        minlength:2,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/,
    },
    password:{
        type:String,
        required:function (){
            return this.provider==='local';
        },
        minlength:8,
    },
    role:{
        type:String,
        enum:['admin','user'],
        default:'user',
    },
    provider:{
        type:String,
        enum:['local','google','github'],
        default:'local',
    },
    providerId:{
        type:String,
        sparse:true,
    },
    icon:{
        type:String,
    }
});

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    // Usamos 10 rondas para generar el salt
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
