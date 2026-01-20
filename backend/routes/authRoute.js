import express from 'express';
import { getMe, login, logout, signUp } from '../controllers/authController.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me",protectRoute, getMe);

export default router;