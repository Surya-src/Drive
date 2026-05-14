const express = require("express")
const dotenv=require('dotenv');
const dbConnection=require("./config/db")
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

dbConnection();

app.get("/",(req,res)=>{
    res.render("index")
})

app.listen(3000,()=>{
    console.log("Server is running");
})

