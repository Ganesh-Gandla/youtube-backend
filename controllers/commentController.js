import Comment from "../models/Comment.js";
import Video from "../models/Video.js";


// -------------------- ADD COMMENT --------------------
export const addComment = async (req, res) => {
  try {
    const { videoId, text } = req.body;

    // Create new comment document with user details
    const newComment = await Comment.create({
      videoId,
      userId: req.user.userId,       // from auth middleware
      username: req.user.username,   // store username directly
      userAvatar: req.user.avatar,   // store user avatar
      text
    });

    // Push commentId into video's comment list
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

    // Get all comments for that video (latest first)
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

    // Check if comment exists
    const comment = await Comment.findOne({ commentId });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only the original commenter can edit the comment
    if (comment.userId !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to update this comment" });
    }

    // Update text only if provided
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

    // Check if comment exists
    const comment = await Comment.findOne({ commentId });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Only the original commenter can delete
    if (comment.userId !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    // Remove comment from DB
    await Comment.findOneAndDelete({ commentId });

    // Also remove reference inside Video.comments array
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
