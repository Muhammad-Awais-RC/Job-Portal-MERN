import { Router } from "express";
import {
	createJob,
	deleteJob,
	getAllJobs,
	getSingleJob,
	getUserJobs,
	updateJobStatus,
} from "../controllers/job.controllers.js";
import { isAuthenticated, isRecruiter } from "../middlewares/auth.js";

const router = new Router();

router.get("/job/my/", isAuthenticated, isRecruiter, getUserJobs);
router.get("/job/:id", isAuthenticated, getSingleJob);
router.get("/job", isAuthenticated, getAllJobs);
router.post("/job", isAuthenticated, isRecruiter, createJob);
router.delete("/job/:id", isAuthenticated, deleteJob);
router.patch("/job/:id", isAuthenticated, updateJobStatus);

export default router;
