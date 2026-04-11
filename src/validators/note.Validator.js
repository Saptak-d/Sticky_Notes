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

export{
    createNoteValidator
}