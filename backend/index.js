import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import userRouter from "./routes/user.routes.js";
import applicationRouter from "./routes/application.routes.js";
import jobRouter from "./routes/job.routes.js";
import companyRouter from "./routes/company.routes.js";
import savedJobRouter from "./routes/saveJob.routes.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
dotenv.config();

app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "../public/temp")));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

app.use("/api", userRouter);
app.use("/api", jobRouter);
app.use("/api", applicationRouter);
app.use("/api", companyRouter);
app.use("/api", savedJobRouter);

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

startServer();

async function startServer() {
	try {
		await mongoose.connect(MONGODB_URI);
		console.log("Connected to MongoDB");

		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (err) {
		console.error("Error connecting to MongoDB:", err);
		process.exit(1);
	}
}
