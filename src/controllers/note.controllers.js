import {ProjectNote} from "../models/note.models.js"
import {ApiError} from "../utils/api-error.js"
import {ApiResponse} from "../utils/api-response.js"
import {asyncHandler} from "../utils/async-handler.js"
import {Project} from "../models/project.models.js"
import mongoose from "mongoose"

const getNotes = asyncHandler(async(req,res)=>{
  const {projectId} = req.params;
   console.log(projectId)

   const project = await Project.findById(projectId);
   if(!project){
    throw new ApiError(404,"project not found")
   }
   const  notes = await ProjectNote.find({project : new mongoose.Types.ObjectId(projectId)}).populate("createdBy", "userName fullName avatar");

   return res
    .status(200)
    .json(
      new ApiResponse(200,notes,"Notes fetched successfully")
    )
});

const createNote = asyncHandler(async (req,res)=>{
   const { projectId } = req.params;
   const { content } = req.body;

    const project = await Project.findById(projectId)

    if(!project){
      throw new ApiError(404,"Project not found")
    }
    const note = await ProjectNote.create({
      project: new mongoose.Types.ObjectId(projectId),
      content,
      createdBy: new mongoose.Types.ObjectId(req.user?._id)
    });

    const populatedNOte = await ProjectNote.findById(note._id).populate("createdBy", "username fullName avatar");
    return res
     .status(200)
     .json(
      new ApiResponse(201,populatedNOte,"Note created Successfully")
     )
   
})

const updateNote = asyncHandler(async(req,res)=>{
    const {noteId} = req.params;
    const {content} = req.body;

     const existingNote  = await ProjectNote.findById(noteId);
     if(!existingNote){
      throw new ApiError(404,"Note not found")
     }

     if(existingNote.createdBy.toString() !=  req.user._id.toString()){
      throw new ApiError(402,"You are not the owner of this note")
     }

     const note = await ProjectNote.findByIdAndUpdate(
      noteId,
      {content},
      {new : true}
     ).populate("createdBy", "username fullName avatar");

     return res
     .status(200)
     .json(
      new ApiResponse(200,note,"Note updated successfully")
     )
});

const deleteNote = asyncHandler(async(req,res)=>{
    const {noteId} = req.params;
    const note = await ProjectNote.findByIdAndDelete(noteId);

    if(!note){
      throw ApiError(404,"note not found")
    }
    return res
     .status(200)
     .json(
      new ApiResponse(200,note,"note deleted successfully")
     )
});

const getNoteById = asyncHandler(async(req,res)=>{
  const {noteId} = req.params;

   const note = await ProjectNote.findById(noteId)
     .populate("createdBy", "username fullName avatar")

     if(!note){
       throw new ApiError(404,"Note not found")
     }

     return res
      .status(200)
      .json(
         new ApiResponse(200,note,"note fetched successfully")
      )
});

export{
   createNote,
   updateNote,
   getNotes,
   deleteNote,
   getNoteById

}