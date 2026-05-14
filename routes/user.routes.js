const express = require('express');
const router = express.Router();
const { body,validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel=require("../models/user.model")

router.get("/test",(req,res)=>{
    res.send("This is a test route")
})

// show register form
router.get("/register",(req,res)=>{
    res.render("register")
})

// user registration
router.post("/register",body('email').trim().isEmail(),body('password').trim().isLength({ min: 6 }),body("username").trim().isLength({min:3}),async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const {username,email,password}=req.body;
        const hashedPassword=await bcrypt.hash(password,10);
        const newUser=await userModel.create({
            username:username,
            email:email,
            password:hashedPassword
        })
        res.json(newUser)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})


router.get("/login",(req,res)=>{
    res.render("login")
})

router.post("/login",body('username').trim(),body('password').trim(),async (req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        res.status(400).json({error: error.message})
    }
    try{
        const {username,password}=req.body;
        const user=  await userModel.findOne({username:username})
        if(!user){
            res.status(400).json({error:"Invalid username or password"})
        }
        const isValid=await bcrypt.compare(password,user.password)
        if(!isValid){
            res.status(400).json({error:"Invalid username or password"})
        }
        const token=jwt.sign({
            userId:user._id,
            username:user.username,
            email:user.email
        },process.env.JWT_SECRET)

        res.cookie("token",token)
        res.send("Login successful")
        
    }
    catch(error){
res.status(500).json({error:error.message})
    }

})

module.exports=router;