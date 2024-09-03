import { model, Schema } from "mongoose";

const savedJobSchema = new Schema(
	{
		user_id: {
			type: Schema.Types.ObjectId,
			ref: "user",
			required: true,
		},
		job_id: {
			type: Schema.Types.ObjectId,
			ref: "job",
			required: true,
		},
	},
	{ timestamps: true }
);

savedJobSchema.index({ user_id: 1, job_id: 1 }, { unique: true });

export const SavedJob = model("savedJob", savedJobSchema);
