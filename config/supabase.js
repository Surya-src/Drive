const {createClient}=require('@supabase/supabase-js')

// Create Supabase client

const supabaseClient = createClient(process.env.SUPABASE_PROJECT_URL, process.env.SUPABASE_API_KEY)

const uploadFileToSupabase=async (fileUrl,buffer,mimetype)=>{
    const {data,error}= await supabaseClient.storage.from(process.env.SUPABASE_BUCKET_NAME).upload(fileUrl,buffer,{
        contentType:mimetype
    })
    if(error){
        throw error
    }
    return data
}

const saveFileRecord=async (username,fileUrl)=>{
    const {data,error}= await supabaseClient.from("Files").insert({
        username:username,
        file_name:fileUrl
    }).select()
    if(error){
        throw error
    }
    return data
}

const getUserFiles=async (username)=>{
    const { data, error } = await supabaseClient
  .storage
  .from(process.env.SUPABASE_BUCKET_NAME)
  .list(`${username}`, {
    limit: 100,
    offset: 0,
    sortBy: { column: 'created_at', order: 'desc'},
  })
  if(error){
    throw error
  } 
  return data
}

const downloadFileFromSupabase=async (fileUrl)=>{
    const { data, error } = await supabaseClient
  .storage
  .from(process.env.SUPABASE_BUCKET_NAME)
  .download(fileUrl)
  if(error){
    throw error
  }
    return data
}



module.exports={uploadFileToSupabase,saveFileRecord,getUserFiles,downloadFileFromSupabase}