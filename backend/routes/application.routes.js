import { Router } from "express";
import {
	createApplication,
	getApplicationByJob,
	getUserApplications,
	updateApplicationStatus,
} from "../controllers/application.controllers.js";
import {
	isAuthenticated,
	isCandidate,
	isRecruiter,
} from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const router = Router();

router.patch(
	"/application/update-status",
	isAuthenticated,
	updateApplicationStatus
);

router.get(
	"/application/my",
	isAuthenticated,
	isCandidate,
	getUserApplications
);

router.get(
	"/application/:id",
	isAuthenticated,
	isRecruiter,
	getApplicationByJob
);
router.post(
	"/application/:id",
	isAuthenticated,
	isCandidate,
	upload.single("resume"),
	createApplication
);

export default router;
