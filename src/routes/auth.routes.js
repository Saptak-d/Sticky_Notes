import { Router } from "express";
import  {upload}  from "../middlewares/multer.middleware.js"
import {validator} from "../middlewares/validator.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {userRegistrationValidator, verifyEmailValidator , loginUserValidator, resendVerifycationEmailValidator , forgotPasswordRequestValidator} from "../validators/auth.Validator.js"
import {registerUser,verifyEmail ,loginUser ,logoutUser, resendVerifycationEmail ,refreshAccessToken,forgotPasswordRequest} from "../controllers/auth.controllers.js"

const router = Router()

router.post(
  "/register",
  upload.single("avatar"),   
  userRegistrationValidator(), 
  validator,                
  registerUser               
);

 router.route("/verify-email/:verificationToken").get(verifyEmailValidator(), validator, verifyEmail)
 router.route("/login").post(loginUserValidator(),validator,loginUser)
 router.route("/logout").get(verifyJWT,logoutUser)
 router.route("/resendVerifycationEmail").post(resendVerifycationEmailValidator(),validator,resendVerifycationEmail)
 router.route("/refreshAccessToken").get(refreshAccessToken)
 router.route("/forgotPasswordRequest").post(forgotPasswordRequestValidator(),validator,forgotPasswordRequest);






 // Secured routes


 export default router; 