import app from "./app.js"
import "dotenv/config"; 
import connectDB from "./db/index.js";


const PORT  = process.env.PORT || 8080;

connectDB()
.then(()=>{
    app.listen(PORT,()=>(console.log(`Server is running on port :${PORT}`)) )
})
.catch((err)=>{
    console.error("monodb connection error",err);
    process.exit(1);
})



