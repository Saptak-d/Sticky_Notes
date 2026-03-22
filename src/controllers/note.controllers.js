import {ProjectNote} from "../models/note.models.js"
import {ApiError} from "../utils/api-error.js"
import {ApiResponse} from "../utils/api-response.js"
import {asyncHandler} from "../utils/async-handler.js"


const createNote = asyncHandler(async (req,res)=>{
   const { projectId } = req.params;
   const { content } = req.body;
   
})