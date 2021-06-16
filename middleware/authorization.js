const jwt = require('jsonwebtoken')
const User = require('../model/user')

const Authorization = async (req,res,next)=>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decodedToken = jwt.verify(token,"thisisatest")
        const user = await User.findOne({_id:decodedToken._id,"tokens.token":token})
        if(!user){
            throw new Error
        }
        req.token = token
        req.user = user
        next()
    }catch(error){
        res.status(401).send("Please Login first!")
    }
    
}

module.exports = Authorization