import { Router } from 'express';
import {
    getChannelStats,
    getChannelVideos,
} from "../controllers/dashboardController.js"
import {authMiddleware} from "../middlewares/authMiddleware.js"

const router = Router();

router.use(authMiddleware); // Apply authMiddleware middleware to all routes in this file

router.route("/stats").get(getChannelStats);
router.route("/videos").get(getChannelVideos);

export default router