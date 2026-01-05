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
        required:function() {
            return this.provider === 'local';
        },
        validate: {
            validator: function(v) {
                if (this.provider === 'local') {
                    return v && v.length >= 2;
                }
                return true;
            },
            message: 'lastName must be at least 2 characters long for local users'
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
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

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);