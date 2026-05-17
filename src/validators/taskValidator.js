import { body , param } from "express-validator";

const createTaskValidator = ()=>{
   
    return[
        param("projectId").trim()
        .notEmpty().withMessage("The project ID is required"),

        body("title").trim()
         .notEmpty().withMessage("The Title is required"),

         body("description").trim()
         .notEmpty().withMessage("The description is required"),

         body("assignedTo").trim()
         .notEmpty().withMessage("The assignedTo is required")
         .isMongoId().withMessage() ,

         body("status").trim()
         .notEmpty().withMessage("The status is required")

    ]
}
const  getTaskValidation = ()=>{
    return[
        param("projectId").trim()
         .notEmpty().withMessage("The Project Id is required")
    ]
}

const updateTaskValidation = () => {
  return [
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Title cannot be empty"),

    body("description")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Description cannot be empty"),

    body("status")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Status cannot be empty"),

    body("assignedTo")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("assignedTo cannot be empty"),
  ];
};

const getTaskByIdValidator = ()=>{
  return[
    param("taskId")
     .trim()
     .notEmpty().withMessage("The Task id is Required")
  ]
}

const deleteTaskValidation = ()=>{
  return[
    param("taskId").trim()
     .notEmpty().withMessage("the TaskId is required")
  ]
}

export{
    createTaskValidator,
    getTaskValidation,
    updateTaskValidation,
    getTaskByIdValidator,
    deleteTaskValidation,

    


    
}