import { Router } from "express";
import {
	addCompany,
	getAllCompanies,
} from "../controllers/company.controllers.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = new Router();

router.get("/company", isAuthenticated, getAllCompanies);
router.post("/company", isAuthenticated, addCompany);

export default router;
