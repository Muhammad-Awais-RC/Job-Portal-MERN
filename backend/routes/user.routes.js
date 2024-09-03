import { Router } from "express";
import {
	addRole,
	getUserDetails,
	loginUser,
	logoutUser,
	registerUser,
	updateUser,
} from "../controllers/user.controllers.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = new Router();

router.get("/get-user", isAuthenticated, getUserDetails);

router.get("/user", isAuthenticated, getUserDetails);
router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.put("/user/add-role", isAuthenticated, addRole);
router.patch("/user/update", isAuthenticated, updateUser);
router.post("/user/logout", logoutUser);

export default router;
