import { Router } from "express";
import  {upload}  from "../middlewares/multer.middleware.js"
import {validator} from "../middlewares/validator.middleware.js"
import {userRegistrationValidator } from "../validators/index.js";
import {registerUser,verifyEmail ,loginUser } from "../controllers/auth.controllers.js"

const router = Router()

 router.route("/register").post(userRegistrationValidator(),validator,upload.single('avatar'),registerUser);
 
 router.route("/verify-email/:verificationToken").get(verifyEmail)
 router.route("/login").post(loginUser)






 // Secured routes


 export default router; 