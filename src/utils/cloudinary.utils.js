import { v2  as cloudinary} from "cloudinary";
import fs from "fs";
import { ApiError } from "./api-error.js";

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key    : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET,
    secure     : true
})

const uploadOnCloudinary = (async(localFilePath)=>{
    try {
        if(!localFilePath) return null;
    
        const fixedPath = localFilePath.replace(/\\/g, "/")
    
            const response = await cloudinary.uploader.upload(fixedPath,{
                resource_type : "auto",
            })
            fs.unlink(fixedPath);
            return response;
    } catch (error) {
         console.log("cloudinary Error-",error)
            fs.unlink(fixedPath);
            console.log("File is removed ")
        
    }
    

})

const deleteOnCloudinary = (async(public_id,resource_type = "image")=>{
    
    try {
         if(!public_id){
            return null;
         }
    
         const response  = await cloudinary.uploader.destroy(public_id,{resource_type});
    
         if(response.result !== "ok" && response.result !== "not found"){
            throw new ApiError(500," internal server Error")
         }
         return response;
    
    } catch (error) {
        console.log("Cloudinary Deletation Error---",error);   
    }



})

export {uploadOnCloudinary , deleteOnCloudinary}
