import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export async function isAuthenticated(req, res, next) {
	const { token } = req.cookies;
	try {
		const decodedData = jwt.verify(token, "dkjhfdskfjejkvjkhkdkfjhdkj");
		req.user = await User.findById(decodedData._id);
		next();
	} catch (error) {
		return res.status(401).json({ error: "Invalid token" });
	}
}

export async function isRecruiter(req, res, next) {
	try {
		const { role } = req.user;
		if (role.toLowerCase() !== "recruiter") throw new Error("unauthorized");
		next();
	} catch (error) {
		console.error("isRecruiter error:", error.message);
		return res.status(401).json({ error: error.message });
	}
}

export async function isCandidate(req, res, next) {
	// console.log(req.url);
	try {
		const { role } = req.user;
		if (role.toLowerCase() !== "candidate")
			throw new Error("unauthorized: Only candidate can apply");
		next();
	} catch (error) {
		console.error("isCandidate error:", error.message);
		return res.status(401).json({ error: error.message });
	}
}
