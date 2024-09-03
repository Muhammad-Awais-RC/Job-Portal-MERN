import { SavedJob } from "../models/savedJob.model.js";
import Job from "../models/job.model.js";

export const handleSaveJob = async (req, res) => {
	try {
		const { jobId } = req.body;

		const isJobExist = await Job.findById(jobId);
		if (!isJobExist) {
			return res.status(404).json({ error: "Job not found" });
		}

		const savedJob = await SavedJob.findOne({
			user_id: req.user._id,
			job_id: jobId,
		});

		if (savedJob) {
			await SavedJob.deleteOne({
				_id: savedJob._id,
			});

			return res.status(200).json({
				success: true,
				message: "Job unsaved successfully",
			});
		}

		await SavedJob.create({
			user_id: req.user._id,
			job_id: jobId,
		});

		return res.status(200).json({
			success: true,
			message: "Job saved successfully",
		});
	} catch (error) {
		console.error("Saved job error:", error.message);
		res.status(500).json({ error: "Server error" });
	}
};

export const getAllSavedJob = async (req, res) => {
	try {
		const user_id = req.user._id;
		const savedJobs = await SavedJob.find({ user_id: user_id }).populate({
			path: "job_id",
			populate: { path: "company_id", select: "name logo_url" },
		});
		const transformedJobs = savedJobs.map((savedJob) => ({
			_id: savedJob._id,
			user_id: savedJob.user_id,
			job: savedJob.job_id,
			createdAt: savedJob.createdAt,
			updatedAt: savedJob.updatedAt,
		}));

		res.status(200).json({
			success: true,
			message: "Saved Job fetched successfully",
			jobs: transformedJobs,
		});
	} catch (error) {
		console.error("Saved job error:", error);
		res.status(500).json({ error: "Server error" });
	}
};
