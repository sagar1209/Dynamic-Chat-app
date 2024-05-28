
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name : {
        type: String,
        required : true
    },
    email :{
        type: String,
        unique : true,
        required:true,
    },
    image:{
        type:String,
        required:true
    },
    is_online:{
        type:String,
        required:true,
        default:'0'
    },
    password:{
        type:String,
        required: true
    }
},{ timestamps: true })

const User = mongoose.model('User',userSchema);

module.exports = User;