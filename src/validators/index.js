import { body } from "express-validator";

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
  ];
};

const userLoginValidator = () => {
  return [
    body("email").isEmail().withMessage("Email is not valid"),
    body("password").notEmpty().withMessage("Password can't be empty"),
  ];
};

export { userRegistrationValidator, userLoginValidator };
