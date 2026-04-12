import { Router } from "express";
import {validator} from "../middlewares/validator.middleware.js"
import {verifyJWT ,validateProjectPermission} from "../middlewares/auth.middleware.js"
import {AvailableUserRoles, UserRolesEnum} from "../utils/constants.js"
import {createNoteValidator,updateNoteValidator,getNotesValidator,deleteNoteValidator,getNoteByIdValidator} from "../validators/note.Validator.js"
import { createNote,updateNote, getNotes,deleteNote,getNoteById} from "../controllers/note.controllers.js";

const router = Router()

router.use(verifyJWT)

router.route("/:projectId")
    .get(validateProjectPermission(AvailableUserRoles),getNotesValidator(),validator,getNotes)
    .post(validateProjectPermission([UserRolesEnum.ADMIN]),createNoteValidator(),validator,createNote)

router.route("/:projectId/:noteId")
    .get(AvailableUserRoles(AvailableUserRoles),getNoteByIdValidator(),validator,getNoteById)
    .put(
         validateProjectPermission([UserRolesEnum.ADMIN]),
          updateNoteValidator(),
          validator,
          updateNote
        )
    .delete(validateProjectPermission([UserRolesEnum.ADMIN]),deleteNoteValidator(),validator,deleteNote);



 export default router; 