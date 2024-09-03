import { Router } from "express";
import {
	getAllSavedJob,
	handleSaveJob,
} from "../controllers/saveJob.controllers.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = Router();

router.post("/save", isAuthenticated, handleSaveJob);
router.get("/save", isAuthenticated, getAllSavedJob);

export default router;
