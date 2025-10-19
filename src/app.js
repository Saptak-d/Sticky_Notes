import express from "express"
const app = express();
import authRoute  from "./routes/auth.routes.js"
 
 app.use(express.json());
// router imports

 import healthCjeckRouter  from "./routes/healthcheck.routes.js"


 app.use("/api/v1/healthcheck",healthCjeckRouter)
 app.use("/api/v1/auth",authRoute)



export default app; 