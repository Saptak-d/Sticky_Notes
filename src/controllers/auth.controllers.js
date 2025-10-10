
 import { body } from "express-validator"
import {asyncHandler} from "../utils/async-handler.js"
import {userRegistrationValidator} from "../validators/index.js"

const registerUser =  asyncHandler( async (req,res)=>{
        const{email,username,password} = req.body   
}) 

const loginuser =  asyncHandler( async (req,res)=>{
        const{email,username,password} = req.body   
}) 

const logoutUser = asyncHandler( async (req,res)=>{
        const{email,username,password} = req.body   
}) 

const verifyEmail = asyncHandler( async (req,res)=>{
        const{email,username,password} = req.body   
}) 

const resendVerifycationEmail  = asyncHandler( async (req,res)=>{
        const{email,username,password} = req.body   
}) 

const refreshAccessToken = asyncHandler( async (req,res)=>{
        const{email,username,password} = req.body   
}) 

const forgotPasswordRequest = asyncHandler( async (req,res)=>{
        const{email,username,password} = req.body   
}) 

const changeCurrentPassword = asyncHandler( async (req,res)=>{
        const{email,username,password} = req.body   
}) 

const getCurrentUser = asyncHandler( async (req,res)=>{
        const{email,username,password} = req.body   
}) 









export {registerUser}