import { Router } from "express"
import { UserController } from "../controllers/UserController.js"

const userController = new UserController()

const sessionRouter = Router();

sessionRouter.get("/premium/:uid", userController.updateRoleUser);