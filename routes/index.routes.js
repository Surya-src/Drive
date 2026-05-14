const express=require('express');
const router=express.Router()
const multer=require('multer')
const storage=multer.memoryStorage()
const upload=multer({storage:storage}) 
const {uploadFileToSupabase,saveFileRecord,getUserFiles,downloadFileFromSupabase}=require("../config/supabase")
const authMiddleware=require("../middlewares/auth.middleware")
const {v4}=require("uuid")


router.get("/home",authMiddleware,async (req,res)=>{
    const {username}=req
    const data= await getUserFiles(username)
    const fileNames=data.map(file=>file.name)
    res.render("home",{files:fileNames})
})

router.post("/upload-file",authMiddleware, upload.single('file'), async (req, res, next) => {
    const file=req.file;
        if(!file){
            return res.status(400).json({error:"No file uploaded"})
        }
        const {originalname,mimetype,buffer}=file;
        const fileUrl=`${req.username}/${originalname}`
    try{
        
        const data= await uploadFileToSupabase(fileUrl,buffer,mimetype)
        const fileRecord= await saveFileRecord(req.username,fileUrl)
        res.json({message:"File uploaded successfully",data:data,fileRecord:fileRecord})
    }
    catch(error){
        if(error.message.includes("The resource already exists")){
            const fileUrl=`${req.username}/${originalname}_${v4()}`
            const data= await uploadFileToSupabase(fileUrl,buffer,mimetype)
            const fileRecord= await saveFileRecord(req.username,fileUrl)
            res.json({message:"File uploaded successfully",data:data,fileRecord:fileRecord})
        }
       return res.status(500).json({error:error.message})
    }

})

router.get("/download/:fileName",authMiddleware,async (req,res)=>{
    try{
    const {fileName}=req.params;
    const fileUrl=`${req.username}/${fileName}`
    const data= await downloadFileFromSupabase(fileUrl)
    const buffer = Buffer.from(
            await data.arrayBuffer()
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${fileName}"`
        );

        res.send(buffer);
}catch(error){
    res.status(500).json({error:error.message})
}})

module.exports=router;