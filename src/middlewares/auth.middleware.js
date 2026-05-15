import mongoose, { Mongoose } from "mongoose";
import { ProjectMember } from "../models/projectmember.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js"
import jwt from "jsonwebtoken"




export const  verifyJWT = asyncHandler(async(req,res,next)=>{

try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "");
     if(!token){
        throw new ApiError(401,"The user need to Login First")
     }
       const dcryptToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
      
    
        const user = await User.findById(dcryptToken._id).select("-password -refreshToken")
   
        if(!user){
            throw new ApiError(401, "Invalid AccessToken ")
        }
    
         req.user = user;
         
         next();
} catch (error) {
    throw new ApiError(401,error?.message || "Invalid AccessToken")
}
});

export const validateProjectPermission = (role = [])=> 
    asyncHandler(async(req,res,next)=>{
    const {projectId} = req.params;
    if(!projectId){
        throw new ApiError(400,"Project ID is Missing");
    }
    const project = await ProjectMember.findOne({
        project : projectId,
        user : new mongoose.Types.ObjectId(req.user._id)
    });

    if(!project){
        throw new ApiError(404,"You are not part of this project")
    }
    const givenRole = project?.role;
    console.log("The roles are ",givenRole)
    if(!role.includes(givenRole)){
        throw new ApiError(403,
             "You do not have permission to perform this action",
        )
    }
    next();
});
