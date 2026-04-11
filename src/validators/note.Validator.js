import { body } from "express-validator";
import { param } from "express-validator";

const createNoteValidator = ()=>{
    return[
        body("content").trim()
        .notEmpty().withMessage("Content field is required"),

        param("projectId").trim()
        .notEmpty().withMessage("project ID is required")

    ]
}
const updateNoteValidator = ()=>{
    return[
         body("content").trim()
        .notEmpty().withMessage("Content field is required"),

        param("noteId").trim()
        .notEmpty().withMessage("Note ID is required")
    ]

}
export{
    createNoteValidator,
    updateNoteValidator
}