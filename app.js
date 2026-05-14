const express = require("express")
const dotenv=require('dotenv');
const dbConnection=require("./config/db")
const errorHandler=require("./middlewares/error.middleware")
dotenv.config();

const app=express()
const userRoutes=require("./routes/user.routes")
const indexRoutes=require("./routes/index.routes")
const cookieParser=require("cookie-parser")

app.set("view engine","ejs")
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use("/user",userRoutes)
app.use("/",indexRoutes)

app.get("/",(req,res)=>{
    res.render("index")
})

// 404 handler - must come after all other routes
app.use((req, res) => {
    res.status(404).render("404");
});

// Global error handling middleware - must be last
app.use(errorHandler);

dbConnection();

app.listen(3000,()=>{
    console.log("Server is running");
})

