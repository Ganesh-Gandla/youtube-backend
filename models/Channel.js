import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const channelSchema = new mongoose.Schema(
  {
    channelId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    channelName: {
      type: String,
      required: [true, "Channel name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    owner: {
      type: String, // userId
      required: true,
    },
    channelBanner: {
      type: String,
      default: "",
    },
    subscribers: {
      type: Number,
      default: 0,
    },
    videos: [
      {
        type: String, // videoId
      }
    ],
  },
  { timestamps: true }
);

const Channel = mongoose.model("Channel", channelSchema);

export default Channel;
