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
      required: true, // reference to video
    },

    userId: {
      type: String,
      required: true, // person who commented
    },

    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
