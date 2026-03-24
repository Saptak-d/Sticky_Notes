import { body } from "express-validator";
import { param } from "express-validator";

const createProjectValidator = ()=>{
    return [
        body("name").trim()
        .notEmpty().withMessage("THe project name section is required"),

        body("description").trim()
        .notEmpty().withMessage("The project description is required")
    ]
}

const getProjectsByIdValidator = ()=>{
    return [
        param("projectId").trim()
        .notEmpty().withMessage("the ProjectID is required")
    ]
}

const updateProjectValidator = ()=>{
    return [
          body("name").trim()
        .notEmpty().withMessage("THe project name section is required"),

        body("description").trim()
        .notEmpty().withMessage("The project description is required")
    ]
}



export{
    createProjectValidator,
    getProjectsByIdValidator,
    updateProjectValidator
    
}