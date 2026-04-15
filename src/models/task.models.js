
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
               url : {
                type :String ,//cloudinary url
                required : true
               },
                public_id :{
                 type : String ,
                 required : true ,
               },
                mimetype: {
                 type : String ,
                 required : true ,
               },
                size: {
                    type : Number ,
                     required : true
                 },
                originalName :{
                    type : String,
                    required :true
                }
            }
        ],
        default : []
    }

},{timestamps:true})
export const Task = mongoose.model("Task",taskSchema);
