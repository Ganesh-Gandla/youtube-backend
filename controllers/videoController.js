import Video from "../models/Video.js";
import Channel from "../models/Channel.js";

// -------------------- UPLOAD VIDEO --------------------
export const uploadVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, category, channelId } = req.body;

    if (!title || !videoUrl || !category || !channelId) {
      return res.status(400).json({ message: "Missing required fields" });
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

    // Add videoId to channel
    await Channel.findOneAndUpdate(
      { channelId },
      { $push: { videos: newVideo.videoId } }
    );

    return res.status(201).json({
      message: "Video uploaded successfully",
      video: newVideo,
    });
  } catch (error) {
    console.error("Error in uploadVideo:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// -------------------- GET ALL VIDEOS --------------------
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    return res.status(200).json(videos);
  } catch (error) {
    console.error("Error in getAllVideos:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// -------------------- GET SINGLE VIDEO --------------------
export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findOne({ videoId: id });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Increase views count
    video.views += 1;
    await video.save();

    return res.status(200).json(video);
  } catch (error) {
    console.error("Error in getVideoById:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// -------------------- UPDATE VIDEO (OWNER ONLY) --------------------
export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findOne({ videoId: id });

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Only uploader can update
    if (video.uploader !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to update this video" });
    }

    const updated = await Video.findOneAndUpdate(
      { videoId: id },
      req.body,
      { new: true }
    );

    return res.status(200).json({
      message: "Video updated successfully",
      video: updated,
    });
  } catch (error) {
    console.error("Error in updateVideo:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// -------------------- DELETE VIDEO (OWNER ONLY) --------------------
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findOne({ videoId: id });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Only uploader can delete
    if (video.uploader !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to delete this video" });
    }

    await Video.findOneAndDelete({ videoId: id });

    // Remove videoId from channel.videos[]
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

// -------------------- LIKE VIDEO --------------------
export const likeVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findOne({ videoId: id });

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    video.likes += 1;
    await video.save();

    return res.status(200).json({
      message: "Video liked",
      likes: video.likes,
    });
  } catch (error) {
    console.error("Error in likeVideo:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// -------------------- DISLIKE VIDEO --------------------
export const dislikeVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findOne({ videoId: id });

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    video.dislikes += 1;
    await video.save();

    return res.status(200).json({
      message: "Video disliked",
      dislikes: video.dislikes,
    });
  } catch (error) {
    console.error("Error in dislikeVideo:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
