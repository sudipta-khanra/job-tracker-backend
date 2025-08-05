import express from "express";
const router = express.Router();

import {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
  showStats,
} from "../controllers/jobController.js";

import authMiddleware from "../middleware/authMiddleware.js";

router.use(authMiddleware);

router.get("/stats", showStats);

router.route("/").get(getJobs).post(createJob);

router.route("/:id").patch(updateJob).delete(deleteJob);

export default router;
