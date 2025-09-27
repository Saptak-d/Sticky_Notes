import mongoose ,{Schema} from "mongoose"
import bcrypt from "bcryptjs";
const userSchema = new Schema({
    avatar : {
        type :{
            url : String,
            localpath : String,
        },
        default :{
            url :`https://placehold.co/600x400`,
            localpath : ""
        }
    },
    username :{
        type : String ,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
       
    },
    email:{
        type : String,
         required : true,
         unique : true,
         lowercase :true,
         trim : true,
       
    },
    fullname :{
        type : String,
        required : true ,
    } ,
     password :{
        type : String,
        required : [true,"password is mandatory"] ,
    } ,
    isEmailVerified:{
        type : Boolean,
        default : false,
    },
    forgotpasswordToken:{
        type : String,
    
    },
    forgotpasswordExpiry:{
        type : Date
    },
    refreshToken : {
        type : String
    },
    emailVerificationToken : {
         type : String
    },
    emailVerificationExpiry :{
        type : Date    
    },


},{timestamps:true})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password , 10)
    next()
})

export const User = mongoose.model("User",userSchema)