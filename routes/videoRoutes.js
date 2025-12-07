// routes/videoRoutes.js
import express from "express";
import {
  uploadVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
  searchVideos,
  getVideosByChannel
} from "../controllers/videoController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllVideos); // GET /api/videos
router.get("/channel/:channelId", getVideosByChannel); // GET /api/videos/channel/:channelId
router.get("/:id", getVideoById); // GET /api/videos/:id

router.post("/", protectRoute, uploadVideo); // POST /api/videos  (protected)
router.put("/:id", protectRoute, updateVideo); // PUT /api/videos/:id
router.delete("/:id", protectRoute, deleteVideo); // DELETE /api/videos/:id

router.post("/:id/like", protectRoute, likeVideo);
router.post("/:id/dislike", protectRoute, dislikeVideo);

router.get("/search/title", searchVideos); // GET /api/videos/search/title?title=foo

export default router;
