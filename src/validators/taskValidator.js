import { body , param } from "express-validator";

const createTaskValidator = ()=>{
   
    return[
        param("projectId").trim()
        .notEmpty().withMessage("The project ID is required"),

        body("title").trim()
         .notEmpty().withMessage("The Title is required"),

         body("description").trim()
         .notEmpty().withMessage("The description is required"),

         body("assignedTo").trim()
         .notEmpty().withMessage("The assignedTo is required")
         .isMongoId().withMessage() ,

         body("status").trim()
         .notEmpty().withMessage("The status is required")

    ]
}
const  getTaskValidation = ()=>{
    return[
        param("projectId").trim()
         .notEmpty().withMessage("The Project Id is required")
    ]
}

export{
    createTaskValidator,
    getTaskValidation,

    
}