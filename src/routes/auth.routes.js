import { Router } from "express";

import {validator} from "../middlewares/validator.middleware.js"
import {userRegistrationValidator } from "../validators/index.js";
import {registerUser,verifyEmail ,loginUser } from "../controllers/auth.controllers.js"

const router = Router()

 router.route("/register").post(userRegistrationValidator(),validator,registerUser);
 router.route("/verify-email/:verificationToken").get(verifyEmail)
 router.route("/login").post(loginUser)

 export default router; 