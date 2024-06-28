import {Router} from "express"
import { registerUser } from "../controllers/userController.js"

const userRouter = Router()

userRouter.route("/signup").post(registerUser)

export default userRouter