import express from "express";
import {
  addComment,
  getCommentsByVideo,
  updateComment,
  deleteComment
} from "../controllers/commentController.js";

import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// ADD COMMENT (Protected)
router.post("/", protectRoute, addComment);

// GET ALL COMMENTS OF A VIDEO (Public)
router.get("/:videoId", getCommentsByVideo);

// UPDATE COMMENT (Protected + Owner Only)
router.put("/:commentId", protectRoute, updateComment);

// DELETE COMMENT (Protected + Owner Only)
router.delete("/:commentId", protectRoute, deleteComment);

export default router;
