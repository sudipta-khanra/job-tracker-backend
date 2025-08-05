import express from "express";
import multer from "multer";
import { storage } from "../utils/cloudinaryConfig.js";

const router = express.Router();

const parser = multer({ storage });

router.post("/upload", parser.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");
  res.json({ url: req.file.path });
});

export default router;
