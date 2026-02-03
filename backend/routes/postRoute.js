import express from "express"
import protectRoute from "../middleware/protectRoute.js";
import { createPost, deletePost } from "../controllers/postController.js";
const router = express.Router();

router.post("/create", protectRoute, createPost);
router.delete("/delete/:id", protectRoute, deletePost);
router.post("/comment/:id",protectRoute, commentOnPost);

export default router;