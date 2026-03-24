import { asyncHandler } from "../utils/async-handler.js"
import { ApiError } from "../utils/api-error.js"
import { ApiResponse } from "../utils/api-response.js"
import {Project} from "../models/project.models.js" 
import mongoose from "mongoose"
import {ProjectMember} from "../models/projectmember.models.js"
import {AvailableUserRoles, UserRolesEnum} from "../utils/constants.js"

const getProjects = asyncHandler( async (req,res)=>{
        
}) 


const getProjectsById = asyncHandler( async (req,res)=>{
        const { projectId } = req.params;  
        console.log("the project id is ",projectId)

        const project  = await Project.findById(projectId);

        if(!project){
                throw new ApiError(404,"Project not Found")
        }

       return res
       .status(200)
       .json(
        new ApiResponse(200,project,"the project is  successfully fetched ")
       ) 

}) 


const createProject = asyncHandler( async (req,res)=>{
        const{name,description} = req.body ;

        const project  = await Project.create({
                name,
                description,
                createdBy : new  mongoose.Types.ObjectId(req.user._id),
        });

        await ProjectMember.create({
                user : new mongoose.Types.ObjectId(project.createdBy),
                project : new mongoose.Types.ObjectId(project._id),
                role : UserRolesEnum.ADMIN,
        });

        return res
        .status(200)
        .json(
                new ApiResponse(200,project,"Project created successfully")
        )
}) 

const updateProject = asyncHandler( async (req,res)=>{
       const {name ,description} = req.body;
        const {projectId} = req.params;
        const project = await Project.findById(projectId);

        if(!project){
                throw new ApiError(404,"The project is not found")
        }

        if(req.user._id.toString() !== project.createdBy.toString()){
                throw new ApiError(401,"The user is not the owner of this project")
        }
         
        const updatedProject = await Project.findByIdAndUpdate(
                projectId,
                {
                      name : name || project.name,
                      description : description || project.description  
                },
                {new : true}
        )

        if(!updatedProject){
                throw new ApiError(500,"Internal server Error while updating the Document")
        }

        return res
        .status(200)
        .json(
                new ApiResponse(200,updatedProject,"the project updated successfully")
        )
}) 

const deleteProject = asyncHandler( async (req,res)=>{
        const{email,username,password} = req.body   
}) 


const addMemberToProject = asyncHandler( async (req,res)=>{
        const{email,username,password} = req.body   
}) 

const getProjectMembers = asyncHandler( async (req,res)=>{
        const{email,username,password} = req.body   
}) 

const updateProjectMembers = asyncHandler( async (req,res)=>{
        const{email,username,password} = req.body   
}) 

const updateProjectMemberRole = asyncHandler( async (req,res)=>{
        const{email,username,password} = req.body   
}) 
const deleteMember = asyncHandler( async (req,res)=>{
        const{email,username,password} = req.body   
}) 

export{createProject,
        getProjectsById,
        updateProject,
        updateProject,
        

        
}