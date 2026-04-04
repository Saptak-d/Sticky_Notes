import { Router } from "express";
import {createProject,getProjectsById,updateProject,deleteProject,addMemberToProject,getProjectMembers ,updateProjectMemberRole,deleteMember} from "../controllers/project.controllers.js"
import {createProjectValidator,getProjectsByIdValidator,updateProjectValidator,deleteProjectValidator, addMemberToProjectValidator,getProjectMembersValidator,updateProjectMemberRoleValidator,deleteMemberValidator} from "../validators/project.Validator.js"
import {validator} from "../middlewares/validator.middleware.js"
import {verifyJWT,validateProjectPermission} from "../middlewares/auth.middleware.js"
import { AvailableUserRoles,UserRolesEnum  } from "../utils/constants.js";

const router = Router()
router.use(verifyJWT);

router.route("/")
     .post(createProjectValidator(),validator,createProject)

router.route("/:projectId")
    .get(validateProjectPermission(AvailableUserRoles),getProjectsByIdValidator(),validator,getProjectsById)
    .patch(validateProjectPermission([UserRolesEnum.ADMIN]),updateProjectValidator(),validator,updateProject)
    .delete(validateProjectPermission([UserRolesEnum.ADMIN]),deleteProjectValidator(),validator,deleteProject)

router.route("/:projectId/members")
     .get(getProjectMembersValidator(),validator,getProjectMembers)
     .post(validateProjectPermission([UserRolesEnum.ADMIN]),addMemberToProjectValidator(),validator,addMemberToProject)


router.route("/:projectId/members/:userId")
     .post(validateProjectPermission([UserRolesEnum.ADMIN]),updateProjectMemberRoleValidator(),validator,updateProjectMemberRole)





 export default router; 