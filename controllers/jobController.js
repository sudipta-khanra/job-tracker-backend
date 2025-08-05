import Job from "../models/Job.js";

export const createJob = async (req, res, next) => {
  try {
    const {
      position,
      company,
      status = "pending",
      jobType = "full-time",
      location = "Unknown",
    } = req.body;
    if (!position || !company) {
      return res.status(400).json({ msg: "Position and company are required" });
    }

    const job = await Job.create({
      position,
      company,
      status,
      jobType,
      location,
      createdBy: req.user._id.toString(),
    });

    res.status(201).json({ job });
  } catch (error) {
    next(error);
  }
};

export const getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ createdBy: req.user._id.toString() }).sort({
      createdAt: -1,
    });
    res.status(200).json({ jobs });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    console.log("Update job called");
    console.log("User ID:", req.user._id);
    console.log("Job ID (param):", req.params.id);
    console.log("Request body:", req.body);

    const { id: jobId } = req.params;
    const { position, company, status, jobType, location } = req.body;

    if (!position || !company) {
      return res.status(400).json({ msg: "Position and company are required" });
    }

    const job = await Job.findOne({
      _id: jobId,
      createdBy: req.user._id.toString(),
    });
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    job.position = position;
    job.company = company;
    job.status = status || job.status;
    job.jobType = jobType || job.jobType;
    job.location = location || job.location;

    await job.save();

    res.status(200).json({ job });
  } catch (error) {
    console.error("Update job error:", error);
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const { id: jobId } = req.params;

    const job = await Job.findOneAndDelete({
      _id: jobId,
      createdBy: req.user._id.toString(),
    });

    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    res.status(200).json({ msg: "Job deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const showStats = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    const stats = await Job.aggregate([
      { $match: { createdBy: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const defaultStats = {
      pending: 0,
      interview: 0,
      declined: 0,
      accepted: 0,
    };

    stats.forEach((item) => {
      defaultStats[item._id] = item.count;
    });

    res.status(200).json({ defaultStats });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching stats" });
  }
};
