const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    age:{
        type:Number,
        default:0,
    },
    phone:{
        type:Number,
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

userSchema.methods.getAuthorized = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},"thisisatest")
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

const User = mongoose.model("User",userSchema) 
module.exports = User


