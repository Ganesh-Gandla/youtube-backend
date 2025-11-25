import express from "express";
import {
  uploadVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
  searchVideos
} from "../controllers/videoController.js";

import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// UPLOAD VIDEO (Protected)
router.post("/", protectRoute, uploadVideo);

// GET ALL VIDEOS (Public)
router.get("/", getAllVideos);

// Search Videos
router.get("/search/title", searchVideos);

// GET SINGLE VIDEO BY ID (Public)
router.get("/:id", getVideoById);

// UPDATE VIDEO (Protected + Owner Only)
router.put("/:id", protectRoute, updateVideo);

// DELETE VIDEO (Protected + Owner Only)
router.delete("/:id", protectRoute, deleteVideo);

// LIKE VIDEO (Protected)
router.put("/:id/like", protectRoute, likeVideo);

// DISLIKE VIDEO (Protected)
router.put("/:id/dislike", protectRoute, dislikeVideo);



export default router;
