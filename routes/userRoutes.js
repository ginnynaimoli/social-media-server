import express from "express";
import { addRemoveFriend, getUser, getUserFriends } from "../controllers/userControllers.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router()

router.get('/:id', verifyToken, getUser)
router.get('/:id/friends', verifyToken, getUserFriends)

router.patch('/:userId/:friendId', verifyToken, addRemoveFriend)

export default router