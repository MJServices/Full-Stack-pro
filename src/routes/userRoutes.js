import {Router} from "express"
import { getChannelProfileDetails, getUser, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateCurrentPassword, updateUserAvatar, updateUserCoverImage, updateUserDetails } from "../controllers/userController.js"
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

router.route("/logout").post(authMiddleware,  logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(authMiddleware, updateCurrentPassword)
router.route("/current-user").get(authMiddleware, getUser)
router.route("/update-account").patch(authMiddleware, updateUserDetails)

router.route("/avatar").patch(authMiddleware, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(authMiddleware, upload.single("coverImage"), updateUserCoverImage)

router.route("/channel").get(authMiddleware, getChannelProfileDetails)
router.route("/history").get(authMiddleware, getWatchHistory)
export default userRouter