import express from "express"
const app = express();
import authRoute  from "./routes/auth.routes.js"
 import cookieParser from "cookie-parser";
 app.use(express.json());
 app.use(cookieParser());
 
// router imports

 import healthCjeckRouter  from "./routes/healthcheck.routes.js"


 app.use("/api/v1/healthcheck",healthCjeckRouter)
 app.use("/api/v1/auth",authRoute)



export default app; 