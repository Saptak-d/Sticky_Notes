import mongoose from "mongoose"

const connectDB = async()=>{

  try{
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDb connected")
    
}catch(error){
    console.error("monodb connection faild ",error);
    
    process.exit(1) 
}    
}
export default connectDB;