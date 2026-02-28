import {asyncHandler} from "../utils/async-handler.js"
import { User } from "../models/user.models.js"
import {ApiError} from "../utils/api-error.js"
import {emailVerificationMailGenContent , forgotPasswordMailGenContent ,sendMail,sendMail} from "../utils/mail.js"
import { ApiResponse } from "../utils/api-response.js"
import crypto from "crypto";
import {uploadOnCloudinary} from "../utils/cloudinary.utils.js"
import jwt from "jsonwebtoken"
import { use } from "react"

const  generateAccessAndRefreshTokens = async (userId)=>{
        try {
        const user = await User.findById(userId);
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

const registerUser =  asyncHandler(async(req,res)=>{

        const{email,username,password, fullname} = req.body 
        
         const imageLocalpath = req.file?.path;

         
        const existUser  = await  User.findOne({
          $or: [{email} , {username}],
        });

        if(existUser){
              throw new ApiError(409 , "User with email or username is already exist ")
        }

        let avatarCloudLink;

          if (imageLocalpath) {
         try {
              avatarCloudLink = await uploadOnCloudinary(imageLocalpath);
             } catch (error) {
               throw new ApiError(500, "Avatar upload failed");
           }
        }
        const user = await User.create({
                avatar : {
                 url : avatarCloudLink?.secure_url || "",
                 public_id : avatarCloudLink?.public_id  || "",
                },
                email,
                password,
                username,
                fullname,
                isEmailVerified: false,
        });

        const {hashedToken , unHashedToken , tokenExpiry} = user.generateTemporaryToken()

        user.emailVerificationToken = hashedToken;
        user.emailVerificationExpiry = tokenExpiry;

        await user.save({validateBeforeSave : false });
        
    // Send mail
    try {
           await sendMail({
             email : user ?.email,
             subject : "Please verify your email",
             mailGenContent : emailVerificationMailGenContent(user.username , 
            `${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashedToken}`    
             )  
           })
    } catch (error) {
        await User.findByIdAndDelete(user._id)
         throw new ApiError(500, "Email sending failed")
    }

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

        const user  = await  User.findOne({$or: [ {email} , {username}]})

      if(!user){
          throw new ApiError(404, "User does not exist");
      }
    
      // Compare the incoming password with hashed password
      const isPasswordValid  = await user.ispasswordCorrect(password)

      if (!isPasswordValid) {
                 throw new ApiError(401, "Invalid Passwworrd");
         }

         if(!user.isEmailVerified){
                        throw new ApiError(402,"User Email is not Verified please Verify Your Email Fist")
         }

         const{accessToken , refreshToken} = await generateAccessAndRefreshTokens(user._id)
       

         // get the user document ignoring the password and refreshToken field
          const loggedInUser = await User.findById(user._id).select(
                "-password -refreshToken  -emailVerificationToken -emailVerificationExpiry"
          );

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
});

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

   return res
   .status(200)
   .json(
        new ApiResponse(200, {isEmailVerified : true},"Email is verified " ))

}) 

const logoutUser = asyncHandler( async (req,res)=>{

        if(!req?.user){
                throw new ApiError(402,"You Need to Login First")
        }
 
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
        
        const user = await User.findOne({$or : [{email} , {username}]})


        if(!user){
                throw new ApiError(402,"The user is not Found")
        }

        const ispasswordCorrect = user.ispasswordCorrect(password);

        if(!ispasswordCorrect){
                throw new ApiError(400,"Invalid credentials")
        }

        try{
                const {hashedToken , unHashedToken , tokenExpiry} = user.generateTemporaryToken()
                
                  user.emailVerificationToken = hashedToken;
                  user.emailVerificationExpiry = tokenExpiry;
                  await  user.save({validateBeforeSave : false});

                await sendMail({
                        email : user?.email,
                        subject : "Please verify your email",
                        mailGenContent : emailVerificationMailGenContent(user.username,`${req.protocol}://${req.get("host")}/api/v1/auth/verify-email/${unHashedToken}`)
                })
        }catch(error){
                throw new ApiError(500, "Internal server error");
        }

        res.
        status(200)
        .json(
                new ApiResponse(200,"The Email verification Link has Sent to your Email")
        )
}) 

const refreshAccessToken = asyncHandler( async (req,res)=>{
        const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken

        if(!incomingRefreshToken ){
                throw new ApiError(400,"you need to login")
        }
        let decordeToken;

       try {
          decordeToken = jwt.verify(
                incomingRefreshToken ,
                process.env.REFRESH_TOKEN_SECRET
        );
        } catch (error) {
                throw new ApiError(401,"Invalid or expired refresh token")
        }

        const user = await User.findById(decordeToken._id).select("-password");

        if(!user){
                throw new ApiError(401, "User not Found")
        }

        if(incomingRefreshToken  !== user.refreshToken){
                throw new ApiError(401,"Refresh token mismatch")
        }

        const {accessToken , refreshToken} = await generateAccessAndRefreshTokens(user._id);

        if(!accessToken || !refreshToken){
                throw new ApiError(400,"Something went wrong while generating the tokens")
        }

        const options = {
                httpOnly : true ,
                secure   : true,
        }

        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
                new ApiResponse(200,
                        {
                                user : user 
                        },
                        "access Token is Refreshed successfully"
                )
        )


}) 

const forgotPasswordRequest = asyncHandler( async (req,res)=>{
        const{email,username} = req.body; 

        const user =  await User.findOne({email,username}).select("-refreshToken");

        if(!user){
                return res
                .status(200)
                .json(
                        
                        new ApiResponse(200,"The ResetPassword link Shared to your Email")
                )
        }

        const {hashedToken , unHashedToken , tokenExpiry} = user.generateTemporaryToken()

        if(!hashedToken || !unHashedToken || !tokenExpiry){
                throw new ApiError(500,"Error while getting Tokens")
        }

        user.forgotpasswordToken = unHashedToken ;
        user.forgotpasswordExpiry = tokenExpiry;

        await user.save({validateBeforeSave : false})

        const sendMail = await sendMail({
                email : user?.email,
                subject : "Reset Your Password",
                mailGenContent : forgotPasswordMailGenContent(user.username,
                        `${req.protocol}://${req.get("host")/api/v1/auth}`
                )
        })
        return res
        .status(200)
        .json(
                new ApiError(200,"The reset password link has shared to your Email")
        )
}) 

const changeCurrentPassword = asyncHandler( async (req,res)=>{
        const{email,username,password} = req.body   
}) 

const getCurrentUser = asyncHandler( async (req,res)=>{
        const{email,username,password} = req.body   
}) 









export {registerUser, 
        verifyEmail ,
        loginUser,
        logoutUser,
        resendVerifycationEmail, 
        refreshAccessToken,
        forgotPasswordRequest
        

     }