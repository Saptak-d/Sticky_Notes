import { Router } from "express";
import  {upload}  from "../middlewares/multer.middleware.js"
import {validator} from "../middlewares/validator.middleware.js"
import {userRegistrationValidator, verifyEmailValidator , loginUserValidator} from "../validators/auth.Validator.js"
import {registerUser,verifyEmail ,loginUser } from "../controllers/auth.controllers.js"

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






 // Secured routes


 export default router; 