import {body} from "express-validator"

const userRegistrationValidator = ()=>{
    return [
        body('email')
        .trim()
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("email is invalid "),

        body("ussername")
        .trim()
        .notEmpty().withMessage("username is required")
        .isLength({min : 3}).withMessage("username should be at least 3 char")
        .isLength({max : 13}).withMessage("user name cant exceed 13 char "),

        body("password").trim()
        .notEmpty().withMessage("password is required")
        .isLength({min : 4}.withMessage("password should be at least 4 char"))
        .isLength({max : 13}).withMessage("password name cant exceed 13 char "),
    ]

}

const userLoginValidator = ()=>{
    return [
        body("email")
        .isEmail().withMessage("email is not valid"),
    
         body("password").notEmpty().withMessage("password cant be empty")
    ]
}

export {userRegistrationValidator , userLoginValidator}
