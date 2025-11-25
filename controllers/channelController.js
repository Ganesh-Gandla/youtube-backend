import Channel from "../models/Channel.js";
import User from "../models/User.js";


// -------------------- CREATE CHANNEL --------------------
export const createChannel = async (req, res) => {
  try {
    const { channelName, description, channelBanner } = req.body;

    if (!channelName) {
      return res.status(400).json({ message: "Channel name is required" });
    }

    // Create new channel
    const newChannel = await Channel.create({
      channelName,
      description,
      channelBanner: channelBanner || "",
      owner: req.user.userId,
    });

    // Add channelId to user's channels array
    await User.findOneAndUpdate(
      { userId: req.user.userId },
      { $push: { channels: newChannel.channelId } }
    );

    return res.status(201).json({
      message: "Channel created successfully",
      channel: newChannel,
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

    const channel = await Channel.findOne({ channelId: id });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    return res.status(200).json(channel);
  } catch (error) {
    console.error("Error in getChannel:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// // -------------------- GET ALL VIDEOS OF A CHANNEL --------------------
// export const getChannelVideos = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const channel = await Channel.findOne({ channelId: id });

//     if (!channel) {
//       return res.status(404).json({ message: "Channel not found" });
//     }

//     return res.status(200).json({
//       videos: channel.videos,
//     });
//   } catch (error) {
//     console.error("Error in getChannelVideos:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // -------------------- UPDATE CHANNEL (OWNER ONLY) --------------------
// export const updateChannel = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const channel = await Channel.findOne({ channelId: id });

//     if (!channel) {
//       return res.status(404).json({ message: "Channel not found" });
//     }

//     // Only owner can update
//     if (channel.owner !== req.user.userId) {
//       return res.status(403).json({ message: "Not authorized to update" });
//     }

//     const updated = await Channel.findOneAndUpdate(
//       { channelId: id },
//       req.body,
//       { new: true }
//     );

//     return res.status(200).json({
//       message: "Channel updated successfully",
//       channel: updated,
//     });
//   } catch (error) {
//     console.error("Error in updateChannel:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // -------------------- DELETE CHANNEL (OWNER ONLY) --------------------
// export const deleteChannel = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const channel = await Channel.findOne({ channelId: id });

//     if (!channel) {
//       return res.status(404).json({ message: "Channel not found" });
//     }

//     // Only owner can delete
//     if (channel.owner !== req.user.userId) {
//       return res.status(403).json({ message: "Not authorized to delete" });
//     }

//     await Channel.findOneAndDelete({ channelId: id });

//     // Remove channel from user's channels array
//     await User.findOneAndUpdate(
//       { userId: req.user.userId },
//       { $pull: { channels: id } }
//     );

//     return res.status(200).json({ message: "Channel deleted successfully" });
//   } catch (error) {
//     console.error("Error in deleteChannel:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };
