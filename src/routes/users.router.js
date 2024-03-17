import { Router } from "express"
import { UserController } from "../controllers/UserController.js"
import upload from "../middlewares/multer.middleware.js";


const userController = new UserController()

const userRouter = Router();

userRouter.put("/premium/:uid", userController.updateRoleUser);

userRouter.post("/:uid/documents",
                    upload.fields([
                        { name: "name", maxCount: 1 },
                        { name: "reference", maxCount: 1 },
                    ]),
                    userController.saveUserDocuments);

export default userRouter