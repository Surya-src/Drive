const express=require('express');
const router=express.Router()
const multer=require('multer')
const storage=multer.memoryStorage()
const upload=multer({storage:storage}) 
const {uploadFileToSupabase,saveFileRecord,getUserFiles,downloadFileFromSupabase}=require("../config/supabase")
const authMiddleware=require("../middlewares/auth.middleware")
const {v4}=require("uuid")


router.get("/",authMiddleware,(req,res)=>{
    res.redirect("/home")
})


router.get("/home",authMiddleware,async (req,res)=>{
    try {
        const {username}=req
        const data= await getUserFiles(username)
        const fileNames=data.map(file=>file.name)
        res.render("home",{files:fileNames})
    } catch (error) {
        res.status(500).render("error", {
            status: 500,
            message: "Failed to load files",
            description: error.message
        });
    }
})

router.post("/upload-file",authMiddleware, upload.single('file'), async (req, res, next) => {
    try {
        const file=req.file;
        if(!file){
            return res.status(400).json({error:"No file uploaded"})
        }
        const {originalname,mimetype,buffer}=file;
        const fileUrl=`${req.username}/${originalname}`
        
        const data= await uploadFileToSupabase(fileUrl,buffer,mimetype)
        const fileRecord= await saveFileRecord(req.username,fileUrl)
        res.redirect("/home")
    }
    catch(error){
        if(error.message.includes("The resource already exists")){
            try {
                const {originalname,mimetype,buffer}=req.file;
                const fileUrl=`${req.username}/${originalname}_${v4()}`
                const data= await uploadFileToSupabase(fileUrl,buffer,mimetype)
                const fileRecord= await saveFileRecord(req.username,fileUrl)
                return res.redirect("/home")
            } catch (retryError) {
                return res.status(500).json({error: retryError.message})
            }
        }
        res.status(500).json({error:error.message})
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
    }
})

module.exports=router;