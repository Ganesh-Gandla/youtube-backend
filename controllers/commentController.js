import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

// -------------------- ADD COMMENT --------------------
export const addComment = async (req, res) => {
  try {
    const { videoId, text } = req.body;

    const newComment = await Comment.create({
      videoId,
      userId: req.user.userId,
      username: req.user.username,
      userAvatar: req.user.avatar,   
      text
    });

    await Video.findOneAndUpdate(
      { videoId },
      { $push: { comments: newComment.commentId } }
    );

    return res.status(201).json({
      message: "Comment added successfully",
      comment: newComment
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};


// -------------------- GET COMMENTS FOR A VIDEO --------------------
export const getCommentsByVideo = async (req, res) => {
  try {
    const { videoId } = req.params;

    const comments = await Comment.find({ videoId }).sort({ createdAt: -1 });

    return res.status(200).json(comments);

  } catch (error) {
    console.error("Error in getCommentsByVideo:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


// -------------------- UPDATE COMMENT --------------------
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;

    const comment = await Comment.findOne({ commentId });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only the original commenter can update
    if (comment.userId !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to update this comment" });
    }

    comment.text = text || comment.text;
    await comment.save();

    return res.status(200).json({
      message: "Comment updated successfully",
      comment,
    });

  } catch (error) {
    console.error("Error in updateComment:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// -------------------- DELETE COMMENT --------------------
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findOne({ commentId });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only owner can delete
    if (comment.userId !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    // Delete comment from DB
    await Comment.findOneAndDelete({ commentId });

    // Remove commentId from video model
    await Video.findOneAndUpdate(
      { videoId: comment.videoId },
      { $pull: { comments: commentId } }
    );

    return res.status(200).json({ message: "Comment deleted successfully" });

  } catch (error) {
    console.error("Error in deleteComment:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
