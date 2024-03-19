import { Router } from "express"
import { UserController } from "../controllers/UserController.js"
import upload from "../middleware/multer.middleware.js";


const userController = new UserController()

const userRouter = Router();

userRouter.put("/premium/:uid", userController.updateRoleUser);

userRouter.post("/:uid/documents",
                    upload.fields([
                        { name: "name", maxCount: 1 },
                        { name: "reference", maxCount: 1 },
                    ]),
                    userController.saveUserDocuments);

userRouter.get("/", userController.getUsers);

userRouter.delete("/", userController.deleteUsers);

export default userRouter