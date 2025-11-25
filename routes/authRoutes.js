import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// REGISTER route
router.post("/register", registerUser);

// LOGIN route
router.post("/login", loginUser);

export default router;
