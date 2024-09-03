import mongoose, { model, Schema } from "mongoose";

const jobSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		location: {
			type: String,
			required: true,
		},
		requirements: {
			type: String,
			required: true,
		},
		recruiter_id: {
			type: Schema.Types.ObjectId,
			ref: "user",
		},
		company_id: {
			type: Schema.Types.ObjectId,
			ref: "company",
		},
		isOpen: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

const Job = model("job", jobSchema);

export default Job;
