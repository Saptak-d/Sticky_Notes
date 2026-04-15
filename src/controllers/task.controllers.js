import {Task} from "../models/task.models.js" ;
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import {asyncHandler} from "../utils/async-handler.js"
import {Project} from '../models/project.models.js'
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";

const createTask = (asyncHandler(async(req,res)=> {

    const { title, description, assignedTo, status } = req.body;
     const {projectId} = req.params;

     const project  = await Project.findById(projectId);
     if(!project){
        throw new ApiError(404,"Project not found")
     }

      const files = req.files || [];
   

       const cloudinaryUploads  = await Promise.all(
         files.map(async (file)=>{
            const response = await uploadOnCloudinary(file.path)
            return{
               url : response.secure_url,
               public_id : response.public_id,
                mimetype: file.mimetype,
                size: response.bytes, 
                 originalName: file.originalname,
            }
         })
       )

       console.log("the fetails",cloudinaryUploads[0])
      const task = Task.create({
         title,
         description,
         assignedTo ,
         assignedBy : req.user?._id,
         project :projectId,
         status,
         attachments : cloudinaryUploads
      });

      if(!task){
         throw new ApiError(500,"Internal server Error")
      }

      return res
       .status(201)
       .json(
          new ApiResponse(201,task,"The New Task created Successfully")
       )
}));

export{
   createTask,

}