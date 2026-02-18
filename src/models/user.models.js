import mongoose ,{Schema} from "mongoose"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import  crypto from "crypto"

const userSchema = new Schema({
    avatar : {
      url : {
        type : String ,
         default :  "https://placehold.co/600x400",
      },
       public_id: {
      type: String
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

userSchema.methods.ispasswordCorrect = async function (password) {
      return await bcrypt.compare(password,this.password)
}


userSchema.methods.generateAccessToken = function(){
   return  jwt.sign({
      _id : this._id,
      email : this.email,
      username : this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn : process.env.ACCESS_TOKEN_EXPIRY}
    )
}

userSchema.methods.generateRefereshToken = function(){
    return jwt.sign({
        _id : this._id,
        email :  this.email,
        username : this.username
    },
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn : process.env.REFRESH_TOKEN_EXPIRY}
    )
}

/**
 * @description Method responsible for generating tokens for email verification, password reset etc.
 */

userSchema.methods.generateTemporaryToken = function(){

     //this function is retun 2 type of token 1 is hash and another is unhased token coz we want to store the hased token in DB and retun unhased token in client side 
   const unHashedToken =  crypto.randomBytes(20).toString("hex")


   const hashedToken = crypto.createHash("sha256").update(unHashedToken).digest("hex")


   const tokenExpiry = Date.now() + (20 * 60 * 1000 ) // 20 min

   
    return {hashedToken , unHashedToken , tokenExpiry}

}

    
export const User = mongoose.model("User",userSchema)      