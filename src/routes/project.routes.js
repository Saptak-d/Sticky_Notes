import { Router } from "express";
import {createProject} from "../controllers/project.controllers.js"
import {createProjectValidator} from "../validators/project.Validator.js"
import {validator} from "../middlewares/validator.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/createProject").post(verifyJWT,createProjectValidator(),validator,createProject)


 export default router; 