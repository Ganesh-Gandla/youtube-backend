import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

// -------------------- ADD COMMENT --------------------
export const addComment = async (req, res) => {
  try {
    const { videoId, text } = req.body;

    if (!videoId || !text) {
      return res.status(400).json({ message: "Video ID and comment text are required" });
    }

    // Create comment
    const newComment = await Comment.create({
      videoId,
      userId: req.user.userId,
      text
    });

    // Add commentId to video's comments array
    await Video.findOneAndUpdate(
      { videoId },
      { $push: { comments: newComment.commentId } }
    );

    return res.status(201).json({
      message: "Comment added successfully",
      comment: newComment
    });

  } catch (error) {
    console.error("Error in addComment:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// -------------------- GET COMMENTS FOR A VIDEO --------------------
export const getCommentsByVideo = async (req, res) => {
  try {
    const { videoId } = req.params;

    // Get all comments for this video
    const comments = await Comment.find({ videoId }).sort({ createdAt: -1 });

    return res.status(200).json(comments);

  } catch (error) {
    console.error("Error in getCommentsByVideo:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
