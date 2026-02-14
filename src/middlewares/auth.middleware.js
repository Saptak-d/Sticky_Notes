import { asyncHandler } from "../utils/async-handler"




export const  verifyJWT = asyncHandler (async(req,res)=>{

const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "");



})