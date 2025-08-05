import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup multer-storage-cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "job-tracker/avatars", // folder in my cloudinary account
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const parser = multer({ storage });

export const uploadAvatar = [
  parser.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // req.file.path is the Cloudinary URL
      return res.status(200).json({ avatarUrl: req.file.path });
    } catch (error) {
      return res.status(500).json({ message: "Upload failed", error });
    }
  },
];
