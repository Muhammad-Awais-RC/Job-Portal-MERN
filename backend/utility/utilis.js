export async function sendToken(user, res, message, statusCode) {
	try {
		const token = user.generateToken();

		const userWithOutPassword = {
			_id: user._id,
			fullName: user.fullName,
			email: user.email,
			role: user.role,
		};
		res.cookie("token", token, {
			maxAge: 15 * 24 * 60 * 60 * 1000, //MS
			httpOnly: true,
			sameSite: "strict",
			secure: process.env.NODE_ENV !== "development",
		});
		res
			.status(statusCode)
			.json({ success: true, message, token, user: userWithOutPassword });
	} catch (error) {
		console.error("Token generation error:", error);
		res.status(500).json({ error: "Server error" });
	}
}
