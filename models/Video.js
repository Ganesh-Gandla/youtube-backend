import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const videoSchema = new mongoose.Schema(
  {
    videoId: {
      type: String,
      default: uuidv4,
      unique: true,
    },

    title: {
      type: String,
      required: [true, "Video title is required"],
      trim: true,
    },

    videoUrl: {
      type: String,
      required: [true, "Video URL is required"],
    },

    thumbnailUrl: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      required: true, // important for filter buttons
    },

    channelId: {
      type: String,
      required: true,
    },

    uploader: {
      type: String, // userId
      required: true,
    },

    views: {
      type: Number,
      default: 0,
    },

    likes: {
      type: Number,
      default: 0,
    },

    dislikes: {
      type: Number,
      default: 0,
    },

    comments: [
      {
        type: String, // commentId
      },
    ],
  },
  { timestamps: true }
);

const Video = mongoose.model("Video", videoSchema);

export default Video;
