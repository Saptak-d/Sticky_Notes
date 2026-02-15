import { v2  as cloudinary} from "cloudinary";
import fs from "fs";
import { ApiError } from "./api-error";

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