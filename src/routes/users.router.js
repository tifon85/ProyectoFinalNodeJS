import { Router } from "express"
import { UserController } from "../controllers/UserController.js"

const userController = new UserController()

const userRouter = Router();

userRouter.put("/premium/:uid", userController.updateRoleUser);

export default userRouter