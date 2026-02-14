import express from "express"
const app = express();

 import cookieParser from "cookie-parser";
 app.use(express.json());
 app.use(cookieParser());
 
// router imports
//Helth check routes
 import healthCjeckRouter  from "./routes/healthcheck.routes.js"
 app.use("/api/v1/healthcheck",healthCjeckRouter)
//authentication routes
import authRoute  from "./routes/auth.routes.js"
 app.use("/api/v1/auth",authRoute)



export default app; 