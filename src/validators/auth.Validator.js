import { body } from "express-validator";
import {param}  from "express-validator"

const userRegistrationValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Email is invalid"),

    body("username")
      .trim()
      .notEmpty().withMessage("Username is required")
      .isLength({ min: 3 }).withMessage("Username should be at least 3 characters")
      .isLength({ max: 13 }).withMessage("Username can't exceed 13 characters"),

    body("password")
      .trim()
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 4 }).withMessage("Password should be at least 4 characters")
      .isLength({ max: 13 }).withMessage("Password can't exceed 13 characters"),
      
      body("fullname")
      .trim()
      .notEmpty()
      .withMessage("The Full Name is required ")

  ];
};

const verifyEmailValidator = () =>{
  return [
     param("verificationToken")
     .notEmpty()
     .withMessage("verificationToken is required")
     .isLength({ min: 20 })
     .withMessage("Invalid token")
  ];
}

const loginUserValidator = () =>{
   return[
     body("password").trim()
     .notEmpty().withMessage("The email is Required"),
     

    body("email").custom((value,{req})=>{
       if(!req.body.email && !req.body.username){

        throw new Error("Email or Username is required")
       }
       return true;
    })
   ]
}

const resendVerifycationEmailValidator = ()=>{
    return [
       body("password").trim()
       .notEmpty().withMessage("The paassword is Required "),

       body("Email").custom((value,{req})=>{
         
         if(!req.body?.email && !req.body?.username){
          throw new Error("Email or Username is required")
         }
         return true;
       })
    ]
}

const forgotPasswordRequestValidator = ()=>{
  return[
    body("email").custom((value,{req})=>{
      if(!req.body.email && !req.body.username)
        throw new Error("email or userName is required")
       return true; 
    })
  ]
}


export { userRegistrationValidator, verifyEmailValidator , loginUserValidator, resendVerifycationEmailValidator , forgotPasswordRequestValidator};
