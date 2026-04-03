import { body } from "express-validator";
import { param } from "express-validator";
import { ApiError } from "../utils/api-error.js";

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

const addMemberToProjectValidator = ()=>{
    return [
        body().custom((value, {req})=>{
            if(!req.body.email && !req.body.username){
                throw new ApiError(401,"Either email or username is required");
            }
            return true;
        }),

    ]
}

const getProjectMembersValidator = ()=>{
    return [
        param("projectId").trim()
        .notEmpty().withMessage("The Project ID is required")
    ]
}

const updateProjectMemberRoleValidator = ()=>{
     const {projectId , userId} = req.params;
        const {newRole} = req.body;
   return[
     param("projectId").trim()
     .notEmpty().withMessage("The Project ID is required"),

     param("userId").trim()
     .notEmpty().withMessage("The UserID is Required"),

     body("newRole").trim()
     .notEmpty().withMessage("The role is required")

   ]
}

export{
    createProjectValidator,
    getProjectsByIdValidator,
    updateProjectValidator,
    deleteProjectValidator,
    addMemberToProjectValidator,
    getProjectMembersValidator,
    updateProjectMemberRoleValidator,
    
    
}