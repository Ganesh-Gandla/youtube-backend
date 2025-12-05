import express from "express";
import {
  createChannel,
  getChannel,
  getChannelVideos,
  updateChannel,
  deleteChannel
} from "../controllers/channelController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE CHANNEL  (Protected)
router.post("/", protectRoute, createChannel); 

// GET CHANNEL BY ID  (Public)
router.get("/:id", getChannel);

// GET ALL VIDEOS OF A CHANNEL (Public)
router.get("/:id/videos", getChannelVideos);

// UPDATE CHANNEL (Protected + Owner Only)
router.put("/:id", protectRoute, updateChannel);

// DELETE CHANNEL (Protected + Owner Only)
router.delete("/:id", protectRoute, deleteChannel);

export default router;
