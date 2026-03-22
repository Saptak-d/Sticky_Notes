import { Router } from "express";
import {createProject,getProjectsById} from "../controllers/project.controllers.js"
import {createProjectValidator,getProjectsByIdValidator} from "../validators/project.Validator.js"
import {validator} from "../middlewares/validator.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/createProject").post(verifyJWT,createProjectValidator(),validator,createProject)
router.route("/getProjectsById/:projectId").get(verifyJWT,getProjectsByIdValidator(),validator,getProjectsById);



 export default router; 