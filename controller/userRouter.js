const mongoose = require('mongoose')
const express = require("express")
const User = require('../model/user')
const Authorization = require('../middleware/authorization')
const port = 3000

const connectionURL = "mongodb+srv://Sachin97659:<password>@cluster0.edxeh.mongodb.net/Users-API?retryWrites=true&w=majority"
mongoose.connect(connectionURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
})
const app = express()
app.use(express.json())

app.post('/createUser',async (req,res)=>{
    const user = await new User(req.body)
    try{
        await user.save()
        const token = await user.getAuthorized()
        res.send({status:"User created successfully",token})
    }catch(error){
        res.status(400).send(error)
    }
})

app.post('/loginUser',async (req,res)=>{
    try{
        const user = await User.findOne({email:req.body.email,password:req.body.password})
        if(!user){
            throw new Error
        }
        const token = await user.getAuthorized()
        res.send({status:"You are logged in!",token})  
    }catch(error){
        res.status(400).send("Invalid credentials")
    }
})

app.post('/logoutUser',Authorization,async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send({status:"Logged out!"})
    }catch(error){
        res.status(400).send("An error occured")
    }
})

app.patch('/updateUser',Authorization,async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ["name","email","password","age","phone"]
    const validUpdate = updates.every((update)=> allowedUpdates.includes(update))
    if(!validUpdate){
        res.status(400).send("Invalid update")
    }
    try{
        const user = req.user
        updates.forEach((update)=> user[update] = req.body[update])
        await user.save()
        res.send({status:"Update successful"})
    }catch(error){
        res.status(400).send(error)
    }
    
    
})

app.delete('/deleteUser',Authorization,async (req,res)=>{
    try{
        await User.deleteOne({_id:req.user._id})
        res.send("User deleted")
    }catch(error){
        res.status(400).send(error)
    }
    
})
app.listen(port,()=>{
    console.log(`Server is up on port ${port}`)
})