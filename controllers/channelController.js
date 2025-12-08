// controllers/channelController.js

import Channel from "../models/Channel.js";
import User from "../models/User.js";


// -------------------- CREATE CHANNEL --------------------
export const createChannel = async (req, res) => {
  try {
    const { channelName, description, channelBanner, channelLogo } = req.body;

    // Validate required fields
    if (!channelName) {
      return res.status(400).json({ message: "Channel name is required" });
    }

    // Create a new channel document
    const newChannel = await Channel.create({
      channelName,
      description: description || "",
      channelBanner: channelBanner || "",
      channelLogo: channelLogo || "",
      owner: req.user.userId, // Owner comes from logged-in user
    });

    // Add new channel ID to the user's channels list
    await User.findOneAndUpdate(
      { userId: req.user.userId },
      { $push: { channels: newChannel.channelId } }
    );

    // Fetch updated user details
    const updatedUser = await User.findOne({ userId: req.user.userId });

    // Send response with new channel + updated user info
    return res.status(201).json({
      message: "Channel created successfully",
      channel: newChannel,
      user: {
        userId: updatedUser.userId,
        username: updatedUser.username,
        email: updatedUser.email,
        channels: updatedUser.channels,
        avatar: updatedUser.avatar
      },
    });
  } catch (error) {
    console.error("Error in createChannel:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



// -------------------- GET CHANNEL BY ID --------------------
export const getChannel = async (req, res) => {
  try {
    const { id } = req.params;

    // Find channel using channelId
    const channel = await Channel.findOne({ channelId: id });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Send channel data
    return res.status(200).json(channel);
  } catch (error) {
    console.error("Error in getChannel:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



// -------------------- GET ALL VIDEOS OF A CHANNEL --------------------
export const getChannelVideos = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if channel exists
    const channel = await Channel.findOne({ channelId: id });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Return only the videos array
    return res.status(200).json({ videos: channel.videos });
  } catch (error) {
    console.error("Error in getChannelVideos:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



// -------------------- UPDATE CHANNEL (OWNER ONLY) --------------------
export const updateChannel = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if channel exists
    const channel = await Channel.findOne({ channelId: id });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Only the owner of the channel is allowed to update
    if (channel.owner !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to update" });
    }

    // Extract fields that can be updated
    const { channelName, description, channelBanner, channelLogo } = req.body;

    const updatedData = {
      ...(channelName && { channelName }),
      ...(description !== undefined && { description }),
      ...(channelBanner !== undefined && { channelBanner }),
      ...(channelLogo !== undefined && { channelLogo }),
    };

    // Update channel and get the updated version
    const updatedChannel = await Channel.findOneAndUpdate(
      { channelId: id },
      updatedData,
      { new: true }
    );

    return res.status(200).json({
      message: "Channel updated successfully",
      channel: updatedChannel,
    });
  } catch (error) {
    console.error("Error in updateChannel:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



// -------------------- DELETE CHANNEL (OWNER ONLY) --------------------
export const deleteChannel = async (req, res) => {
  try {
    const { id } = req.params;

    // Check channel exists
    const channel = await Channel.findOne({ channelId: id });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    // Only owner can delete
    if (channel.owner !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to delete" });
    }

    // Delete channel from DB
    await Channel.findOneAndDelete({ channelId: id });

    // Remove channel from user's channel list
    await User.findOneAndUpdate(
      { userId: req.user.userId },
      { $pull: { channels: id } }
    );

    return res.status(200).json({ message: "Channel deleted successfully" });
  } catch (error) {
    console.error("Error in deleteChannel:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
