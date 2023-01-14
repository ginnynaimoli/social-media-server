import express from "express";
import { getAllPosts, getUserPosts, likePost } from "../controllers/postControllers.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router()

router.get('/', verifyToken, getAllPosts)
router.get('/:userId', verifyToken, getUserPosts)

router.patch('/:postId/like', verifyToken, likePost)

export default router