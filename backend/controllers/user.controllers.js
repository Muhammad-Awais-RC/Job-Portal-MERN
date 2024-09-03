import { User } from "../models/user.model.js";
import { sendToken } from "../utility/utilis.js";

export const getUserDetails = (req, res) => {
	try {
		console.log(req.user.fullName);
		console.log("getUserDetails", req.user);

		if (req.user) {
			return res.status(200).json({ user: req.user });
		} else {
			return res.status(401).json({ error: "User is not authenticated" });
		}
	} catch (error) {
		return res.status(500).json({ error: "Server error" });
	}
};

export const registerUser = async (req, res) => {
	const { fullName, email, password } = req.body;

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (!emailRegex.test(email)) {
		return res.status(400).json({ error: "Invalid email format" });
	}

	try {
		let user = await User.findOne({ email });

		if (user) {
			return res.status(400).json({ error: "User already exists" });
		}

		user = new User({ fullName, email, password });
		await user.save();

		sendToken(user, res, `Registered Successfully`, 201);
	} catch (error) {
		console.error("Registration error:", error);
		res.status(500).json({ error: "Server error" });
	}
};

export const loginUser = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({ error: "Invalid email or password" });
		}

		const isMatch = await user.comparePassword(password);

		if (!isMatch)
			return res.status(400).json({ error: "Invalid email or password" });

		sendToken(user, res, `Login Successfully`, 200);
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ error: "Server error" });
	}
};

export const addRole = async (req, res) => {
	const { _id } = req.user;
	let { role } = req.body;

	// console.log(role);

	if (!role) {
		return res.status(400).json({ error: "Role is required" });
	}

	role = role.toLowerCase();

	const allowedRoles = ["recruiter", "candidate"];
	if (!allowedRoles.includes(role)) {
		return res.status(403).json({ error: "Invalid role specified" });
	}

	try {
		const user = await User.findById(_id);

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		user.role = role;
		await user.save();

		const userWithoutPassword = user.toObject();
		delete userWithoutPassword.password;

		res.status(200).json({
			success: true,
			message: "Role added successfully",
			user: userWithoutPassword,
		});
	} catch (error) {
		console.error("Add Role error:", error);
		res.status(500).json({ error: "Server error" });
	}
};

export const updateUser = () => {};

export const logoutUser = (req, res) => {
	res
		.status(200)
		.cookie("token", "", {
			expires: new Date(Date.now() - 1),
			path: "/",
		})
		.json({
			success: true,
			message: "Logout successfully",
		});
};
