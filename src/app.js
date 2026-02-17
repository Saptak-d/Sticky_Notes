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


 app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  })
})

export default app; 