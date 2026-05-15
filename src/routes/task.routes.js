import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import {validator} from "../middlewares/validator.middleware.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {validateProjectPermission} from "../middlewares/auth.middleware.js"
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js";
import {createTask, getTask , updateTask} from "../controllers/task.controllers.js";
import {createTaskValidator, getTaskValidation,updateTaskValidation} from "../validators/taskValidator.js"

// 699407cdba4132d843b3317f = saptakdutta95

const router = Router()
router.use(verifyJWT)

router.route("/:projectId")
    .get(
      validateProjectPermission(AvailableUserRoles),
      getTaskValidation(),
      validator,
      getTask
   )
   .post(
     validateProjectPermission([UserRolesEnum.ADMIN , UserRolesEnum.PROJECT_ADMIN]),
     upload.array("attachments"),
     createTaskValidator(),
     validator,
     createTask,
   )
   
router.route("/:projectId/t/:taskId")
.patch(
    validateProjectPermission([UserRolesEnum.ADMIN , UserRolesEnum.PROJECT_ADMIN]),
     upload.array("attachments"),
    updateTaskValidation(),
    validator,
    updateTask
   )


export default router;