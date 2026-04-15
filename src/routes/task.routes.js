import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import {validator} from "../middlewares/validator.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {validateProjectPermission} from "../middlewares/auth.middleware.js"
import { UserRolesEnum } from "../utils/constants.js";
import {createTask } from "../controllers/task.controllers.js";
import {createTaskValidator} from "../validators/taskValidator.js"



const router = Router()
router.use(verifyJWT)

router.route("/:projectId")
   .post(
     validateProjectPermission([UserRolesEnum.ADMIN , UserRolesEnum.PROJECT_ADMIN]),
     createTaskValidator(),
     validator,
     createTask,
   )



export default router;