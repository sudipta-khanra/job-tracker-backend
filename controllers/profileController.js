import User from "../models/User.js";

export const uploadAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.avatarUrl = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({ avatarUrl: user.avatarUrl });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};
