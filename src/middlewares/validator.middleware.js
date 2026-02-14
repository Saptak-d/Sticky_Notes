import  {validationResult}  from "express-validator"
import {ApiError} from "../utils/api-error.js"



 export const validator = (req, res, next) => {
  const errors = validationResult(req);

  if(errors.isEmpty()){
            return next()
         }

   const  extractedError = errors.array().map(err =>({
     [err.path] : err.msg
   }));

    throw new ApiError(422,"Recieved data is not valid",extractedError)
  
};
