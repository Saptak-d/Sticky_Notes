import { Router } from "express";
import {createTask } from "../controllers/task.controllers.js";
import {upload} from "../middlewares/multer.middleware.js"
import {validator} from "../middlewares/validator.middleware.js"


const router = Router()



export default router;