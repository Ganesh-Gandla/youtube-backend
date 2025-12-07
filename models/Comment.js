import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const commentSchema = new mongoose.Schema(
  {
    commentId: {
      type: String,
      default: uuidv4,
      unique: true,
    },

    videoId: {
      type: String,
      required: true,
    },

    userId: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
    },

    userAvatar: {
      type: String,
      default: "",
    },

    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
    },

  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
