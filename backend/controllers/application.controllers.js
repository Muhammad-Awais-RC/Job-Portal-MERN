import Application from "../models/application.model.js";
import cloudinary from "../utility/cloudinary.js";

export const getApplicationByJob = async (req, res) => {
	const jobId = req.params.id;
	try {
		const applications = await Application.find({ job_id: jobId });

		return res.status(200).json({
			success: true,
			applications,
		});
	} catch (error) {
		console.error("Get Application by job :", error);
		res.status(500).json({ error: "Server error" });
	}
};

import path from "path";

export const createApplication = async (req, res) => {
	const jobId = req.params.id;
	const user = req.user;
	const { name, education, experience, skills, status } = req.body;
	const resume = req.file;

	if (!name || !education || !experience || !skills || !status || !resume) {
		return res.status(400).json({ error: "All fields are required" });
	}

	try {
		const resumeUrl = `/uploads/${resume.filename}`;

		const application = new Application({
			name,
			education,
			experience,
			skills,
			status,
			resume: resumeUrl,
			job_id: jobId,
			candidate_id: user._id,
		});

		const savedApplication = await application.save();

		res.status(201).json({
			success: true,
			message: "Application posted successfully",
			application: savedApplication,
		});
	} catch (error) {
		console.error("Create Application error:", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const getUserApplications = async (req, res) => {
	const user = req.user;

	try {
		const applications = await Application.find({
			candidate_id: user._id,
		}).populate({
			path: "job_id",
			populate: {
				path: "company_id",
				select: "name logo_url",
			},
		});

		const modifiedApplications = applications.map((app) => ({
			_id: app._id,
			candidate_id: app.candidate_id,
			job: {
				_id: app.job_id._id,
				title: app.job_id.title,
				description: app.job_id.description,
				requirements: app.job_id.requirements,
				recruiter_id: app.job_id.recruiter_id,
				isOpen: app.job_id.isOpen,
				createdAt: app.job_id.createdAt,
				updatedAt: app.job_id.updatedAt,
				company: {
					_id: app.job_id.company_id._id,
					name: app.job_id.company_id.name,
					logo_url: app.job_id.company_id.logo_url,
				},
			},
			education: app.education,
			experience: app.experience,
			skills: app.skills,
			name: app.name,
			resume: app.resume,
			status: app.status,
			createdAt: app.createdAt,
			updatedAt: app.updatedAt,
		}));

		// console.log(modifiedApplications);

		res.status(200).json({
			success: true,
			applications: modifiedApplications,
		});
	} catch (error) {
		console.error("Get User Applications error:", error);
		res.status(500).json({ error: "Server error" });
	}
};
export const updateApplicationStatus = async (req, res) => {
	const { status, appId } = req.body;
	try {
		if (!status || !appId) {
			return res
				.status(400)
				.json({ error: "Status and application ID are required" });
		}
		const application = await Application.findByIdAndUpdate(
			{ _id: appId, recruiter_id: req.user._id },
			{ status: status },
			{ new: true }
		);

		res.status(200).json({
			success: true,
			application,
			message: "Application updated successfully",
		});
	} catch (error) {
		console.error("Update Application Status error:", error);
		res.status(500).json({ error: "Server error" });
	}
};
