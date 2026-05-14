const jwt=require("jsonwebtoken")

const authMiddleware=(req,res,next)=>{
    const token=req.cookies.token;
    if(!token){
        // For API endpoints, return JSON error; for page requests, redirect with error
        if(req.path.includes("/api") || req.path.includes("/upload") || req.path.includes("/download")){
            return res.status(401).json({error:"No token provided. Please login first."})
        }
        return res.redirect("/user/login?error=Please login to continue")
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        const {username}=decoded
        req.username=username
        next()
    }
    catch(error){
        // For API endpoints, return JSON error; for page requests, redirect with error
        if(req.path.includes("/api") || req.path.includes("/upload") || req.path.includes("/download")){
            return res.status(401).json({error:"Invalid or expired token. Please login again."})
        }
        res.redirect("/user/login?error=Session expired. Please login again.")
    }
}

module.exports=authMiddleware;