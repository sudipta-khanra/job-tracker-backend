import express from "express";
import protect from "../middleware/authMiddleware.js";
import multer from "multer";
import { storage } from "../utils/cloudinaryConfig.js";
import User from "../models/User.js";

const router = express.Router();
const upload = multer({ storage });
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

router.post(
  "/profile/avatar",
  protect,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file || !req.file.path) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.avatarUrl = req.file.path; // Cloudinary URL
      await user.save();

      res.json({ avatarUrl: user.avatarUrl });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      res.status(500).json({ message: "Server error uploading avatar" });
    }
  }
);

export default router;
