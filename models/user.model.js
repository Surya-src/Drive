const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minlength:[3,"Username must be at least 3 characters long"]
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
        trim:true,
        minlength:[6,"Password must be at least 6 characters long"]
    }

})

const userModel=mongoose.model("User",userSchema)

module.exports=userModel;