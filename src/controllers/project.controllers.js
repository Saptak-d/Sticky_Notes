import { asyncHandler } from "../utils/async-handler.js"
import { ApiError } from "../utils/api-error.js"
import { ApiResponse } from "../utils/api-response.js"
import {Project} from "../models/project.models.js" 
import mongoose from "mongoose"
import {ProjectMember} from "../models/projectmember.models.js"
import {AvailableUserRoles, UserRolesEnum} from "../utils/constants.js"

const getProjects = asyncHandler( async (req,res)=>{
        const{email,username,password} = req.body   

}) 


const getProjectsById = asyncHandler( async (req,res)=>{
        const{email,username,password} = req.body   
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
        const{email,username,password} = req.body   
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

export{createProject
        
}