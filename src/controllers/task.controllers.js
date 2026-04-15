import {Task} from "../models/task.models.js" ;
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import {asyncHandler} from "../utils/async-handler.js"
import {Project} from '../models/project.models.js'

const createTask = (asyncHandler(async(req,res)=>{
    const { title, description, assignedTo, status } = req.body;
     const {projectId} = req.params;
     const project  = await Project.findById(projectId);
     if(!project){
        throw new ApiError(404,"Project not found")
     }
      const files = req.files || [];
      const 
}))