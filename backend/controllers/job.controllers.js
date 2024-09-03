import Application from "../models/application.model.js";
import Job from "../models/job.model.js";

export const getSingleJob = async (req, res) => {
	try {
		const { id } = req.params;

		// console.log(id);

		const job = await Job.findOne({ _id: id }).populate("company_id");

		if (!job) {
			return res.status(404).json({ success: false, error: "Job not found" });
		}

		const applications = await Application.find({ job_id: id }).populate(
			"candidate_id"
		);

		res.status(200).json({
			success: true,
			job,
			applications,
		});
	} catch (error) {
		console.error("Get All Jobs error:", error);
		res.status(500).json({ error: "Server error" });
	}
};

export const getAllJobs = async (req, res) => {
	try {
		const { location, company_id, searchQuery } = req.query;

		let query = {};

		if (location) query.location = location;

		if (company_id) query.company_id = company_id;

		if (searchQuery) query.title = searchQuery;

		const jobs = await Job.find(query).populate("company_id");

		res.status(200).json({
			success: true,
			jobs,
		});
	} catch (error) {
		console.error("Get All Jobs error:", error);
		res.status(500).json({ error: "Server error" });
	}
};

export const createJob = async (req, res) => {
	const user = req.user;

	if (user.role.toLowerCase() !== "recruiter") {
		return res
			.status(403)
			.json({ error: "Only recruiters are allowed to post jobs" });
	}

	const { title, description, requirements, company_id, location } = req.body;

	try {
		const job = new Job({
			title,
			description,
			requirements,
			company_id,
			location,
			recruiter_id: user._id,
			isOpen: true,
		});

		await job.save();

		res.status(201).json({
			success: true,
			message: "Job posted successfully",
			job,
		});
	} catch (error) {
		console.error("Create Job error:", error);
		res.status(500).json({ error: "Server error" });
	}
};

export const deleteJob = async (req, res) => {
	const user = req.user;
	const jobId = req.params.id;

	try {
		const job = await Job.findById(jobId);

		if (!job) return res.status(404).json({ error: "Job not found" });

		if (job.recruiter_id.toString() !== user._id.toString())
			return res
				.status(403)
				.json({ error: "You are not allowed to delete this job" });

		await Job.deleteOne({ _id: jobId });

		res.status(200).json({
			success: true,
			message: "Job deleted successfully",
		});
	} catch (error) {
		console.error("Delete Job error:", error);
		res.status(500).json({ error: "Server error" });
	}
};

export const updateJobStatus = async (req, res) => {
	const user = req.user;
	const jobId = req.params.id;
	const { isOpen } = req.body;
	try {
		const job = await Job.findById(jobId);

		if (!job) return res.status(404).json({ error: "Job not found" });

		if (job.recruiter_id.toString() !== user._id.toString())
			return res.status(403).json({
				error: "You are not allowed to change the status of this job",
			});

		const updatedJob = await Job.findByIdAndUpdate(jobId, { isOpen });

		if (!updatedJob)
			return res.status(404).json({ error: "failed update status" });
		res.status(200).json({
			success: true,
			message: "Status updated successfully",
			job: updatedJob,
		});
	} catch (error) {
		console.error("Update Job Status error:", error);
		res.status(500).json({ error: "Server error" });
	}
};

export const getUserJobs = async (req, res) => {
	const user = req.user;

	try {
		const jobs = await Job.find({ recruiter_id: user._id }).populate(
			"company_id"
		);

		res.status(200).json({
			success: true,
			jobs,
		});
	} catch (error) {
		console.error("Error getting user jobs:", error);
		res.status(500).json({ error: "Server error" });
	}
};
