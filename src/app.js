import express from "express"

const app = express();
// router imports
 import healthCjeckRouter  from "./routes/healthcheck.routes.js"

 app.use("/api/v1/healthcheck",healthCjeckRouter)


export default app;