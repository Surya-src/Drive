const mongoose=require('mongoose');

const dbConnection=()=>{
 mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("Database connected successfully");
 })
}

module.exports=dbConnection;