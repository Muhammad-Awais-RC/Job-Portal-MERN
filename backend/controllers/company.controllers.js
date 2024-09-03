import { Company } from "../models/company.model.js";
import cloudinary from "../utility/cloudinary.js";
import formidable from "formidable";

export const addCompany = async (req, res) => {
	const { name, logo } = req.body;

	if (!name) return res.status(400).json({ error: "Company name is required" });

	try {
		let logoUrl = null;

		if (logo) {
			const uploadedResponse = await cloudinary.uploader.upload(logo);
			if (uploadedResponse && uploadedResponse.secure_url) {
				logoUrl = uploadedResponse.secure_url;
			} else {
				return res.status(500).json({ error: "Failed to upload logo" });
			}
		}

		const newCompany = new Company({
			name,
			logo_url: logoUrl || null,
		});

		const savedCompany = await newCompany.save();

		res.status(201).json({
			success: true,
			message: "Company added successfully",
			company: savedCompany,
		});
	} catch (error) {
		if (error.code === 11000) {
			res.status(409).json({ error: "Company with this name already exists" });
		} else {
			console.error("Error in addCompany:", error.message);
			res.status(500).json({ error: error.message });
		}
	}
};

export const getAllCompanies = async (req, res) => {
	try {
		const companies = await Company.find();
		res.status(200).json({
			success: true,
			data: companies,
		});
	} catch (error) {
		console.error("Error in getAllCompany:", error.message);
		res.status(500).json({ error: error.message });
	}
};
