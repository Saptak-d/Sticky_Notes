import { Router } from "express";
import { createNote } from "../controllers/note.controllers.js";
import {verifyJWT ,validateProjectPermission} from "../middlewares/auth.middleware.js"
import {validator} from "../middlewares/validator.middleware.js"
import {AvailableUserRoles, UserRolesEnum} from "../utils/constants.js"
import {createNoteValidator} from "../validators/note.Validator.js"

const router = Router()

router.use(verifyJWT)

router.route("/:projectId")
    .post(validateProjectPermission([UserRolesEnum.ADMIN]),createNoteValidator(),validator,createNote)











 export default router; 