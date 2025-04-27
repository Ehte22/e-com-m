import express from "express"
import * as userController from "../controllers/user.controller"
import multerMiddleware from "../utils/upload"

const userRoutes = express.Router()
const upload = multerMiddleware()

userRoutes
    .get("/", userController.getAllUsers)
    .get("/:id", userController.getUserById)
    .put("/update/:id", upload.single("profile"), userController.updateUser)
    .put("/status/:id", userController.updateUserStatus)
    .put("/delete/:id", userController.deleteUser)

export default userRoutes