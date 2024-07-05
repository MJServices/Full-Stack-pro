import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/commentController.js"
import {authMiddleware} from "../middlewares/authMiddleware.js"

const router = Router();

router.use(authMiddleware); // Apply authMiddleware middleware to all routes in this file

router.route("/:videoId").get(getVideoComments).post(addComment);
router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router