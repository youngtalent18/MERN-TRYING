import express from 'express';
import { signUp } from '../controllers/authController.js';

const router = express.Router();

router.get("/", signUp);

export default router;