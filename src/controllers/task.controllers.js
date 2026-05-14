import {Task} from "../models/task.models.js" ;
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import {asyncHandler} from "../utils/async-handler.js"
import {Project} from '../models/project.models.js'
import { uploadOnCloudinary } from "../utils/cloudinary.utils.js";
import mongoose, { mongo } from "mongoose";

const getTask  = asyncHandler(async(req,res)=>{
    const {projectId} = req.params
    const project = await Project.findById(projectId);

    if(!project){
      throw new ApiError(404,"Project not Found")
    }
    const task = await Task.aggregate([
      {
         $match : {
            project : new mongoose.Types.ObjectId(project)
         }
      },
       {
         $lookup : {
            from : "projects",
            localField : "project",
            foreignField : "_id",
            as           : "Project_Details"
         }
       },
        {$unwind : "$Project_Details"},
      {
         $lookup : {
            from : "users",
            localField : "assignedBy",
            foreignField : "_id",
                      as : "assignedBy"
         }
      },
       {$unwind : "$assignedBy"},
      {
          $lookup : {
              from : "users",
            localField : "assignedTo",
            foreignField : "_id",
                      as : "assignedTo"
          }
      },
         {$unwind : "$assignedTo"},
      {
         $project:{
               title : 1,
               description : 1 ,
               Project_Details : {
                  name : 1,
                  description : 1,
               },
               assignedBy : {
                  avatar : 1 ,
                  username : 1,
                  email : 1,
                  fullname : 1,
               },
               assignedTo : {
                  avatar : 1,
                  username : 1,
                  email : 1,
                  fullname : 1,
               }
         }
      }
   
    ]);

    console.log("the Task is--",task);

    return res
     .status(200)
     .json(
       new ApiResponse(200,task,"the taskes are fetched successfully")
     )
});

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

      const task = await Task.create({
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

const updateTask = asyncHandler(async(req,res)=>{
  const {taskId} = req.params;
  const existingTask = await Task.findById(taskId);

  if(!existingTask){
    throw new ApiError(404,"Task not Found")
  }
  if(Object.keys(req.body).length === 0){
   throw new ApiError(400,"No fields provided for update ")
  }

  const updatedTask = await Task.findByIdAndUpdate(
   taskId,
   {
      $set : req.body
   },
   {
      new : true,
      runValidators : true,
   }
  );

  return res
   .status(200)
   .json(
      new ApiResponse(200,updateTask,"the Task successfully Updated")
   )
})




export{
   createTask,
   getTask,
   updateTask,
   

}