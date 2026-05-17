import {Task} from "../models/task.models.js" ;
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import {asyncHandler} from "../utils/async-handler.js"
import {Project} from '../models/project.models.js'
import { uploadOnCloudinary,deleteOnCloudinary } from "../utils/cloudinary.utils.js";
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
                      as : "Project_Details"
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
                attachments: {
               url: 1,
              }
               ,
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

const getTaskById = asyncHandler(async (req,res)=>{
   const {taskId} = req.params;
   const task  = await Task.aggregate([
      {
         $match : {
            _id : new mongoose.Types.ObjectId(taskId)
         }
      },
      {
         $lookup : {
            from : "users",
            localField : "assignedTo",
            foreignField : "_id",
              as : "assignedTo",
              pipeline : [{  
                $project : {
                _id: 1,
                 username: 1,
                 fullname: 1,
                 avatar: 1,
                }}
              ]
         }
      },
      // {$unwind : "$assignedTo"},
      {
         $lookup : {
            from : "subtasks",
            localField : "_id",
            foreignField : "task",
            as : "subtasks",
            pipeline : [
               {
                  $lookup : {
                     from : "users",
                     localField : "createdBy",
                     foreignField : "_id",
                      as :"createdBy",
                      pipeline :[
                      {  $project : {
                           _id : 1 ,
                           username : 1,
                           fullname : 1 ,
                           avatar : 1
                        }}
                      ]
                  }
               },
               {
                  $addFields : {
                     createdBy : {
                        $arrayElemAt : ["$createdBy",0],
                     }
                  }
               }
            ]
         }
      },
      {
         $addFields : {
            assignedTo : {
               $arrayElemAt : ["$assignedTo", 0]
            }
         }
      },
      {
         $lookup : {
            from : "users",
            localField : "assignedBy",
            foreignField : "_id",
            as : "assignedBy",
            pipeline : [
               {$project : {
                  id : 1 ,
                  username : 1,
                  fullname : 1 ,
                  avatar : 1,
               }},
               
            ]
         }
      },
      {$unwind : "$assignedBy"}
      
   ]);

   console.log(task)
})

const updateTask = asyncHandler(async(req,res)=>{
  const {taskId} = req.params;
  const existingTask = await Task.findById(taskId);

  if(!existingTask){
    throw new ApiError(404,"Task not Found")
  }
   const files = req.files || [];
 
    let uploadedDocuments = [];

    if(files.length > 0){

      uploadedDocuments = await Promise.all(
       files.map(async(file)=>{
         const response  = await uploadOnCloudinary(file.path);

         return {
            url : response.secure_url,
            public_id : response.public_id,
             mimetype: file.mimetype,
             size: response.bytes, 
            originalName: file.originalname,
         }
       })
     )  
    }

  if(Object.keys(req.body).length === 0 && uploadedDocuments.length === 0){
   throw new ApiError(400,"No fields provided for update ")
  }

  const updateQuery = {
   $set : req.body,
  };

   if(uploadedDocuments.length > 0){
      updateQuery.$push = {
         attachments : {
            $each : uploadedDocuments
         }
      }
   }

  const updatedTask = await Task.findByIdAndUpdate(
   taskId,
   updateQuery,
   {
      new : true,
      runValidators : true,
   }
  );

  return res
   .status(200)
   .json(
      new ApiResponse(200,updatedTask,"the Task successfully Updated")
   )
});






export{
   createTask,
   getTask,
   updateTask,
   getTaskById


}