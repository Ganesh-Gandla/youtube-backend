// controllers/videoController.js

import Video from "../models/Video.js";
import Channel from "../models/Channel.js";

/**
 * Upload video (protected route)
 * Required — title, videoUrl, category, channelId
 */
export const uploadVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, category, channelId } = req.body;

    // Validate required fields
    if (!title || !videoUrl || !category || !channelId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if channel exists and user owns it
    const channel = await Channel.findOne({ channelId });
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    if (channel.owner !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to upload to this channel" });
    }

    // Create new video document
    const newVideo = await Video.create({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      category,
      channelId,
      uploader: req.user.userId,
    });

    // Add videoId to channel's video list
    await Channel.findOneAndUpdate(
      { channelId },
      { $push: { videos: newVideo.videoId } }
    );

    return res.status(201).json({
      message: "Video uploaded successfully",
      video: newVideo
    });

  } catch (error) {
    console.error("Error in uploadVideo:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



/**
 * Get all videos (optionally filter by category)
 * Supports pagination — skip & limit
 */
export const getAllVideos = async (req, res) => {
  try {
    const { category } = req.query;
    const limit = req.query.limit ? parseInt(req.query.limit) : 0;
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;

    const pipeline = [];

    // Filter by category
    if (category) pipeline.push({ $match: { category } });

    // Lookup channel info for each video
    pipeline.push(
      {
        $lookup: {
          from: "channels",
          localField: "channelId",
          foreignField: "channelId",
          as: "channel"
        }
      },
      { $unwind: "$channel" },
      { $sort: { createdAt: -1 } }
    );

    // Pagination
    if (skip) pipeline.push({ $skip: skip });
    if (limit) pipeline.push({ $limit: limit });

    const videos = await Video.aggregate(pipeline);

    return res.status(200).json(videos);

  } catch (error) {
    console.error("Error in getAllVideos:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



/**
 * Get all videos for a specific channel
 * Returns: { channel, videos }
 */
export const getVideosByChannel = async (req, res) => {
  try {
    const { channelId } = req.params;

    // Get channel details
    const channel = await Channel.findOne({ channelId });
    if (!channel) return res.status(404).json({ message: "Channel not found" });

    // Fetch all videos belonging to this channel
    const videos = await Video.aggregate([
      { $match: { channelId } },
      {
        $lookup: {
          from: "channels",
          localField: "channelId",
          foreignField: "channelId",
          as: "channel"
        }
      },
      { $unwind: "$channel" },
      { $sort: { createdAt: -1 } }
    ]);

    return res.status(200).json({ channel, videos });

  } catch (error) {
    console.error("Error in getVideosByChannel:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



/**
 * Get single video by videoId
 * Also auto-increments views
 */
export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findOne({ videoId: id });
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Increment view count
    video.views = (video.views || 0) + 1;
    await video.save();

    // Fetch channel info for video
    const channel = await Channel.findOne({ channelId: video.channelId });

    return res.status(200).json({ video, channel });

  } catch (error) {
    console.error("Error in getVideoById:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



/**
 * Update video (only uploader can update)
 */
export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findOne({ videoId: id });
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Only video uploader can update
    if (video.uploader !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to update this video" });
    }

    // Update video fields (only what is provided)
    const updated = await Video.findOneAndUpdate(
      { videoId: id },
      req.body,
      { new: true }
    );

    return res.status(200).json({
      message: "Video updated successfully",
      video: updated
    });

  } catch (error) {
    console.error("Error in updateVideo:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



/**
 * Delete video (only uploader can delete)
 */
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findOne({ videoId: id });
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Only uploader can delete video
    if (video.uploader !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to delete this video" });
    }

    // Delete video from DB
    await Video.findOneAndDelete({ videoId: id });

    // Remove video from channel.videos array
    await Channel.findOneAndUpdate(
      { channelId: video.channelId },
      { $pull: { videos: id } }
    );

    return res.status(200).json({ message: "Video deleted successfully" });

  } catch (error) {
    console.error("Error in deleteVideo:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



/**
 * Like video (simple increment)
 */
export const likeVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findOne({ videoId: id });
    if (!video) return res.status(404).json({ message: "Video not found" });

    video.likes = (video.likes || 0) + 1;
    await video.save();

    return res.status(200).json({
      message: "Video liked",
      likes: video.likes
    });

  } catch (error) {
    console.error("Error in likeVideo:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



/**
 * Dislike video (simple increment)
 */
export const dislikeVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findOne({ videoId: id });
    if (!video) return res.status(404).json({ message: "Video not found" });

    video.dislikes = (video.dislikes || 0) + 1;
    await video.save();

    return res.status(200).json({
      message: "Video disliked",
      dislikes: video.dislikes
    });

  } catch (error) {
    console.error("Error in dislikeVideo:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



/**
 * Search videos by title (case-insensitive)
 */
export const searchVideos = async (req, res) => {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const videos = await Video.aggregate([
      { $match: { title: { $regex: title, $options: "i" } } },
      {
        $lookup: {
          from: "channels",
          localField: "channelId",
          foreignField: "channelId",
          as: "channel"
        }
      },
      { $unwind: "$channel" },
      { $sort: { createdAt: -1 } }
    ]);

    return res.status(200).json(videos);

  } catch (error) {
    console.error("Error in searchVideos:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
