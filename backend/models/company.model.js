import { model, Schema } from "mongoose";

const companySchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		logo_url: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

export const Company = model("company", companySchema);
