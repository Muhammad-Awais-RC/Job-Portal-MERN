import { model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ["candidate", "recruiter"],
		},
	},
	{ timestamps: true }
);

// Hashing password before saving user
userSchema.pre("save", async function (next) {
	// skiping the hashing is password is not modified
	if (!this.isModified("password")) return next();

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		next(error);
	}
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password) {
	try {
		return await bcrypt.compare(password, this.password);
	} catch (error) {
		throw new Error("Error comparing passwords");
	}
};

// Method to generate token
userSchema.methods.generateToken = function () {
	return jwt.sign({ _id: this._id }, "dkjhfdskfjejkvjkhkdkfjhdkj", {
		expiresIn: "15d",
	});
};

export const User = model("user", userSchema);
