
import mongoose , {Schema} from "mongoose";
import { AvailabletaskStatus,TaskStatusEnum } from "../utils/constants.js";

const taskSchema = new Schema({
    title : {
        type:String,
        required : true ,
        trim : true,
    },
    description :{
        type: String,
    },
    project:{
        type : Schema.Types.ObjectId,
        ref:"Project",
        required : true,
    },
    assignedTo : {
        type :Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    assignedBy : {
        type :Schema.Types.ObjectId,
        ref:"User",
        required : true
    },
    status:{
        type:String,
        enum: AvailabletaskStatus ,
        default : TaskStatusEnum .TODO 
    },
    attachments :{
         type:[
            {
               url: String,
               public_id: String,
               mimetype: String,
               size: Number,
               originalName: String,
            }
        ],
        default : []
    }

},{timestamps:true})
export const Task = mongoose.model("Task",taskSchema);
