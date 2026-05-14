const express = require('express');
const router = express.Router();
const { body,validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel=require("../models/user.model")


// show register form
router.get("/register",(req,res)=>{
    const error = req.query.error || null;
    res.render("register", { error })
})

// user registration
router.post("/register",body('email').trim().isEmail(),body('password').trim().isLength({ min: 6 }),body("username").trim().isLength({min:3}),async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(e => `${e.param}: ${e.msg}`).join(", ");
        return res.redirect(`/user/register?error=${encodeURIComponent(errorMessages)}`);
    }
    try {
        const {username,email,password}=req.body;
        const hashedPassword=await bcrypt.hash(password,10);
        const newUser=await userModel.create({
            username:username,
            email:email,
            password:hashedPassword
        })
        // Redirect to login with success message
        res.redirect("/user/login?message=Registration successful! Please login.");
    } catch (error) {
        const errorMsg = error.message.includes("duplicate") ? "Username or email already exists" : error.message;
        res.redirect(`/user/register?error=${encodeURIComponent(errorMsg)}`);
    }
})


router.get("/login",(req,res)=>{
    const error = req.query.error || null;
    res.render("login", { error })
})

router.post("/login",body('username').trim(),body('password').trim(),async (req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        const errorMessages = errors.array().map(e => `${e.param}: ${e.msg}`).join(", ");
        return res.redirect(`/user/login?error=${encodeURIComponent(errorMessages)}`);
    }
    try{
        const {username,password}=req.body;
        const user=  await userModel.findOne({username:username})
        if(!user){
            return res.redirect("/user/login?error=Invalid username or password");
        }
        const isValid=await bcrypt.compare(password,user.password)
        if(!isValid){
            return res.redirect("/user/login?error=Invalid username or password");
        }
        const token=jwt.sign({
            userId:user._id,
            username:user.username,
            email:user.email
        },process.env.JWT_SECRET)

        res.cookie("token",token)
        res.redirect("/home");
        
    }
    catch(error){
        res.redirect(`/user/login?error=${encodeURIComponent(error.message)}`);
    }

})

router.get("/logout",(req,res)=>{
    res.clearCookie("token")
    res.redirect("/user/login?message=Logged out successfully");
})

module.exports=router;