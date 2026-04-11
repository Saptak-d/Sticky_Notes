import { Router } from "express";
import { createNote } from "../controllers/note.controllers";
import {verifyJWT ,validateProjectPermission} from "../middlewares/auth.middleware"
import {validator} from "../middlewares/validator.middleware"
import {AvailableUserRoles, UserRolesEnum} from "../utils/constants"

const router = Router()

router.use(verifyJWT)

router.route(":/projectId")
    .post(validateProjectPermission([UserRolesEnum.ADMIN]),)











 export default router; 