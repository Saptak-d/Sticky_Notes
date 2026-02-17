import { User } from "../models/user.models";
import { ApiError } from "../utils/api-error";
import { asyncHandler } from "../utils/async-handler"
import jwt from "jsonwebtoken"




export const  verifyJWT = asyncHandler(async(req,res,next)=>{

try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "");
     if(token){
        throw new ApiError(401,"The user need to Login First")
     }
       const dcryptToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user = User.findById(dcryptToken._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401, "Invalid AccessToken ")
        }
    
         req.user = user;
         
         next();
} catch (error) {
    throw new ApiError(401,error?.message || "Invalid AccessToken")
}
})