import { model, Schema } from "mongoose";

const applicationSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		education: {
			type: String,
			required: true,
		},
		experience: {
			type: String,
			required: true,
		},
		skills: {
			type: String,
			required: true,
		},
		resume: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: ["Applied", "Interviewing", "Rejected", "Selected"],
			required: true,
		},
		job_id: {
			type: Schema.Types.ObjectId,
			ref: "job",
		},
		candidate_id: {
			type: Schema.Types.ObjectId,
			ref: "user",
		},
	},
	{ timestamps: true }
);

const Application = model("application", applicationSchema);

export default Application;
