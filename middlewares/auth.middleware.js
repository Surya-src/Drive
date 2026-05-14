const jwt=require("jsonwebtoken")

const authMiddleware=(req,res,next)=>{
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({error:"Unauthorized"})
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        const {username}=decoded
        req.username=username
        next()
    }
    catch(error){
        res.status(401).json({error:error.message})
    }
}

module.exports=authMiddleware;