import { Router } from "express";
import {registerUser} from "../controllers/auth.controllers.js"
import {validator} from "../middlewares/validator.middleware.js"
import {userRegistrationValidator } from "../validators/index.js";
import {verifyEmail} from "../controllers/auth.controllers.js"

const router = Router()

 router.route("/register").post(userRegistrationValidator(),validator,registerUser);
 router.route("/verify-email/:verificationToken").get(verifyEmail)

 export default router; 