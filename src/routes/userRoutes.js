import {Router} from "express"
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/userController.js"
import { upload } from "../middlewares/multerMiddleware.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"
const userRouter = Router()

userRouter.route("/signup").post( 
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]), 
    registerUser
)

userRouter.route("/login").post(loginUser)
userRouter.route("/logout").post(authMiddleware, logoutUser)
userRouter.route("/refreshAccessToken").post(refreshAccessToken)

export default userRouter