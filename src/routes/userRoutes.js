import {Router} from "express"
import { registerUser } from "../controllers/userController.js"
import { upload } from "../middlewares/multerMiddleware.js"
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

export default userRouter