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
        
        param("projectId").trim()
        .notEmpty().withMessage("The project id is required"),

          body("name").trim()
        .notEmpty().withMessage("THe project name section is required"),

        body("description").trim()
        .notEmpty().withMessage("The project description is required")
    ]
}

const deleteProjectValidator = ()=>{
    return[
        param("projectId").trim()
        .notEmpty().withMessage("The ProjectID is required")
    ]
}


export{
    createProjectValidator,
    getProjectsByIdValidator,
    updateProjectValidator,
    deleteProjectValidator
    
}