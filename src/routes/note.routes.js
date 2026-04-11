import { Router } from "express";
import { createNote,updateNote } from "../controllers/note.controllers.js";
import {verifyJWT ,validateProjectPermission} from "../middlewares/auth.middleware.js"
import {validator} from "../middlewares/validator.middleware.js"
import {AvailableUserRoles, UserRolesEnum} from "../utils/constants.js"
import {createNoteValidator,updateNoteValidator} from "../validators/note.Validator.js"

const router = Router()

router.use(verifyJWT)

router.route("/:projectId")
    .post(validateProjectPermission([UserRolesEnum.ADMIN]),createNoteValidator(),validator,createNote)

router.route("/:projectId/:noteId")
    .put(
         validateProjectPermission([UserRolesEnum.ADMIN]),
          updateNoteValidator(),
          validator,
          updateNote
        )











 export default router; 