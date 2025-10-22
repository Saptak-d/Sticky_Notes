
 import { body } from "express-validator"
import {asyncHandler} from "../utils/async-handler.js"
import {userRegistrationValidator} from "../validators/index.js"
import { User } from "../models/user.models.js"
import {ApiError} from "../utils/api-error.js"
import {emailVerificationMailGenContent , forgotPasswordMailGenContent ,sendMail} from "../utils/mail.js"
import Mailgen from "mailgen"
import { ApiResponse } from "../utils/api-response.js"
import crypto from "crypto";
import { set } from "mongoose"

 const  generateAccessAndRefreshTokens = async (userId)=>{
        try {
        const user = await User.findById(userId);
         console.log(user)
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefereshToken();
         // attach refresh token to the user document to avoid refreshing the access token with multiple refresh tokens
                user.refreshToken = refreshToken;
                await user.save({validateBeforeSave : false});

                return {accessToken , refreshToken}


        } catch (error) {
                throw new ApiError(500 , "something went wrong while generating the access token ") 
        }
 }

const registerUser =  asyncHandler( async (req,res)=>{

        const{email,username,password, fullname} = req.body  

        const existUser  = await  User.findOne({
          $or: [{email} , {username}],
        });

        if(existUser){
              throw new ApiError(409 , "User with email or username is already exist  ")
        }

        const user = await User.create({
                email,
                password,
                username,
                fullname,
                isEmailVerified: false,
        });

          /**
   * assign hashedToken and tokenExpiry in DB till user clicks on email verification link
   * The email verification is handled by {@link verifyEmail}
   */

        const {hashedToken , unHashedToken , tokenExpiry} = user.generateTemporatryToken()
        console.log(unHashedToken);

        user.emailVerificationToken = hashedToken;
        user.emailVerificationExpiry = tokenExpiry;
        console.log(hashedToken ,unHashedToken);

        await user.save({validateBeforeSave : false });

         const mailContent = emailVerificationMailGenContent(
  user.username,
  `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashedToken}`
);
console.log("Mail content:", mailContent);
console.log("user.email:", user.email);


console.log("Verification URL:", `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashedToken}`);


       await sendMail({
         email : user ?.email,
         subject : "Please verify your email",
         mailGenContent : emailVerificationMailGenContent(user.username , 
        `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashedToken}`    
         )  
       })
        const createdUser  = await User.findById(user._id).select(
                "-password -refreshToken -emailVerificationToken -emailVerificationExpiry" 
        )
        if(!createdUser){
                throw new ApiError(500 ,"Something went wrong while registering the user")
        }

        return res.status(201).json(
                new  ApiResponse(
                 201,
                {user : createdUser},
                "User registered successfully  and verification email has been sent on your email"
                )
        )
  
}) 

const loginUser =  asyncHandler( async (req,res)=>{

       const { email, username, password } = req.body;
    

        if(!email || !username){
              throw new ApiError(400, "All Filed is required")
        }

      const user  = await  User.findOne({$or: [ {email} , {username}]})


      if(!user){
          throw new ApiError(404, "User does not exist");
      }
    
      // Compare the incoming password with hashed password
      const isPasswordValid  = await user.ispasswordCorrect(password)

        console.log("valid : ---------- " ,isPasswordValid)

      if (!isPasswordValid) {
                 throw new ApiError(401, "Invalid user credentials");
         }
         const{accessToken , refreshToken} = await generateAccessAndRefreshTokens(user._id)
       

         // get the user document ignoring the password and refreshToken field
          const loggedInUser = await User.findById(user._id).select(
                "-password -refreshToken  -emailVerificationToken -emailVerificationExpiry"
          );
            console.log("thi ---------------",loggedInUser);

          const option = {
                httpOnly : true,
                secure: process.env.NODE_ENV === "production"
          }
           return res.status(200)
           .cookie("accessToken",accessToken,option)
           .cookie("refreshToken",refreshToken,option)
           .json(
                new ApiResponse(
                        200,
                 {user : loggedInUser, refreshToken ,accessToken},
                 "User logged in successfully",
                ),
           );
}) ;

const verifyEmail = asyncHandler( async (req,res)=>{

  const {verificationToken} = req.params;
  if(!verificationToken){
        throw new ApiError(400 , "Email verification token is missing ")
  }
   
  let hashedToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
 
   const  user  =  await User.findOne({
        emailVerificationToken : hashedToken,
    emailVerificationExpiry :{$gt : Date.now()}
   })

   if(!user){
        new ApiError(489 , "Token is invalid or expired")
   }

   user.emailVerificationToken = undefined;
   user.emailVerificationExpiry = undefined;
   user.isEmailVerified = true;
   await user.save({validateBeforeSave : false});

   return res.status(200).json(
        new ApiResponse(200, {isEmailVerified : true},"Email is verified " ))

}) 

const logoutUser = asyncHandler( async (req,res)=>{
 
        await User.findByIdAndUpdate( req.user._id ,
           {
                $set:{
                        refreshToken : ""
                }
           },

           {new:true}
        
        )
        const option = {
                httpOnly : true,
                secure :process.env.NODE_ENV === "production",
        }
        res
        .status(200)
        .clearCookie("accessToken",option)
        .clearCookie("refreshToken",option)
        .json(new ApiResponse(200, {} ,"user Logout"));

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









export {registerUser , verifyEmail ,loginUser}