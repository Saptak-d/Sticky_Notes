import { Router } from "express";
import {createProject,getProjectsById,updateProject,deleteProject} from "../controllers/project.controllers.js"
import {createProjectValidator,getProjectsByIdValidator,updateProjectValidator,deleteProjectValidator} from "../validators/project.Validator.js"
import {validator} from "../middlewares/validator.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/createProject").post(verifyJWT,createProjectValidator(),validator,createProject)
router.route("/getProjectsById/:projectId").get(verifyJWT,getProjectsByIdValidator(),validator,getProjectsById)
router.route("/updateProject/:projectId").patch(verifyJWT,updateProjectValidator(),validator,updateProject)
router.route("/deleteProject/:projectId").delete(verifyJWT,deleteProjectValidator(),validator,deleteProject)




 export default router; 